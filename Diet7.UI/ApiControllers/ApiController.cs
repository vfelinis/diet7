using Diet7.UI.Constants;
using Diet7.UI.Data;
using Diet7.UI.Data.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Diet7.UI.ApiControllers
{
    [ApiController]
    public class ApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _config;

        public ApiController(ApplicationDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        [HttpGet("api/menus/{userId}")]
        public async Task<List<IllnessDto>> GetMenus([FromRoute] string userId)
        {
            var illnesses = await _context.Illnesses.Where(s => s.IsActive).OrderBy(s => s.Name).Select(s => new IllnessDto
            {
                Id = s.Id,
                Name = s.Name,
                MenuItems = new List<MenuItemDto>()
            }).ToListAsync();

            var user = await _context.AppUsers.FirstOrDefaultAsync(s => s.UniqueId == userId);
            if (user != null)
            {
                var menuItems = await _context.Menus.Include(s => s.MenuItems).ThenInclude(s => s.Recipe).Where(s => s.UserId == user.Id).ToListAsync();
                illnesses.ForEach(illness =>
                {
                    illness.MenuItems = menuItems.Where(s => s.IllnessId == illness.Id).SelectMany(s => s.MenuItems).OrderBy(s => s.Recipe.Name).Select(s => new MenuItemDto
                    {
                        Id = s.Id,
                        Day = s.Day,
                        Hour = s.Hour,
                        Recipe = new RecipeDto
                        {
                            Id = s.Recipe.Id,
                            Name = s.Recipe.Name,
                            Description = s.Recipe.Description,
                            Type = s.Recipe.Type,
                            Calories = s.Recipe.Calories,
                            Image = string.IsNullOrEmpty(s.Recipe.Image) ? null : $"http://{_config.GetValue<string>("Host")}/{AppConstants.ImageBaseFolder}/{AppConstants.RecipeImageFolder}/{s.Recipe.Image}"
                        }
                    }).ToList();
                });
            }

            return illnesses;
        }

        [HttpDelete("api/menus/{userId}/items/{itemId}")]
        public async Task DeleteMenuItem([FromRoute] string userId, [FromRoute] int itemId)
        {
            var user = await _context.AppUsers.FirstOrDefaultAsync(s => s.UniqueId == userId);
            if (user != null)
            {
                var menuItem = await _context.MenuItems.FirstOrDefaultAsync(s => s.Id == itemId && s.Menu.UserId == user.Id);
                if (menuItem != null)
                {
                    _context.MenuItems.Remove(menuItem);
                    await _context.SaveChangesAsync();
                }
            }
        }

        [HttpGet("api/recipes/{userId}")]
        public async Task<List<RecipeDto>> GetRecipes([FromRoute] string userId)
        {
            var user = await _context.AppUsers.FirstOrDefaultAsync(s => s.UniqueId == userId);
            var entries = user != null
                ? _context.Recipes.Where(s => !s.RecipeItems.Any(r => r.Product.ExcludeProducts.Any(e => e.UserId == user.Id)))
                : _context.Recipes;
            var recipes = await entries.Where(s => s.IsActive).OrderBy(s => s.Name).Select(s => new RecipeDto
            {
                Id = s.Id,
                Name = s.Name,
                Description = s.Description,
                Type = s.Type,
                Calories = s.Calories,
                Image = s.Image
            }).ToListAsync();

            recipes.ForEach(recipe =>
            {
                if (!string.IsNullOrEmpty(recipe.Image))
                {
                    recipe.Image = $"http://{_config.GetValue<string>("Host")}/{AppConstants.ImageBaseFolder}/{AppConstants.RecipeImageFolder}/{recipe.Image}";
                }
            });

            return recipes;
        }

        [HttpGet("api/recipeDetail/{userId}/{recipeId}")]
        public async Task<RecipeDto> GetRecipeDetail([FromRoute] string userId, [FromRoute] int recipeId)
        {
            var recipe = await _context.Recipes.Where(s => s.Id == recipeId).Select(s => new RecipeDto
            {
                Id = s.Id,
                Name = s.Name,
                Description = s.Description,
                Type = s.Type,
                Calories = s.Calories,
                Image = s.Image,
                Products = s.RecipeItems.Select(ri => new ProductDto
                {
                    Id = ri.Product.Id,
                    Name = ri.Product.Name,
                    Description = ri.Product.Description,
                    Image = ri.Product.Image,
                    Calories = ri.Product.Calories,
                    AllowedFor = ri.Product.AllowedProducts.Select(ap => ap.Illness.Name).ToList(),
                    ProhibitedFor = ri.Product.ProhibitedProducts.Select(ap => ap.Illness.Name).ToList()
                }).ToList(),
                CookingSteps = s.CookingSteps.Select(cs => new CookingStepDto
                {
                    Name = cs.Name,
                    Description = cs.Description,
                    Image = cs.Image
                }).ToList()
            }).FirstOrDefaultAsync();

            var user = await _context.AppUsers.FirstOrDefaultAsync(s => s.UniqueId == userId);
            if (user != null)
            {
                var excludedProducts = await _context.ExcludeProducts.AsNoTracking().Where(s => s.UserId == user.Id).ToListAsync();
                if (!string.IsNullOrEmpty(recipe.Image))
                {
                    recipe.Image = $"http://{_config.GetValue<string>("Host")}/{AppConstants.ImageBaseFolder}/{AppConstants.RecipeImageFolder}/{recipe.Image}";
                }
                recipe.Products.ForEach(product =>
                {
                    if (!string.IsNullOrEmpty(product.Image))
                    {
                        product.Image = $"http://{_config.GetValue<string>("Host")}/{AppConstants.ImageBaseFolder}/{AppConstants.ProductImageFolder}/{product.Image}";
                    }
                    product.IsExcluded = excludedProducts.Any(s => s.ProductId == product.Id);
                });
                recipe.CookingSteps.ForEach(cookingStep =>
                {
                    if (!string.IsNullOrEmpty(cookingStep.Image))
                    {
                        cookingStep.Image = $"http://{_config.GetValue<string>("Host")}/{AppConstants.ImageBaseFolder}/{AppConstants.CookingStepImageFolder}/{cookingStep.Image}";
                    }
                });
            }
            else
            {
                if (!string.IsNullOrEmpty(recipe.Image))
                {
                    recipe.Image = $"http://{_config.GetValue<string>("Host")}/{AppConstants.ImageBaseFolder}/{AppConstants.RecipeImageFolder}/{recipe.Image}";
                }
                recipe.Products.ForEach(product =>
                {
                    if (!string.IsNullOrEmpty(product.Image))
                    {
                        product.Image = $"http://{_config.GetValue<string>("Host")}/{AppConstants.ImageBaseFolder}/{AppConstants.ProductImageFolder}/{product.Image}";
                    }
                });
                recipe.CookingSteps.ForEach(cookingStep =>
                {
                    if (!string.IsNullOrEmpty(cookingStep.Image))
                    {
                        cookingStep.Image = $"http://{_config.GetValue<string>("Host")}/{AppConstants.ImageBaseFolder}/{AppConstants.CookingStepImageFolder}/{cookingStep.Image}";
                    }
                });
            }

            return recipe;
        }

        [HttpGet("api/products/{userId}")]
        public async Task<List<ProductDto>> GetProdutcs([FromRoute] string userId)
        {
            var products = await _context.Products.Where(s => s.IsActive).OrderBy(s => s.Name).Select(s => new ProductDto
            {
                Id = s.Id,
                Name = s.Name,
                Description = s.Description,
                Image = s.Image,
                Calories = s.Calories,
                AllowedFor = s.AllowedProducts.Select(ap => ap.Illness.Name).ToList(),
                ProhibitedFor = s.ProhibitedProducts.Select(ap => ap.Illness.Name).ToList()
            }).ToListAsync();

            var user = await _context.AppUsers.FirstOrDefaultAsync(s => s.UniqueId == userId);
            if (user != null)
            {
                var excludedProducts = await _context.ExcludeProducts.AsNoTracking().Where(s => s.UserId == user.Id).ToListAsync();
                products.ForEach(product =>
                {
                    if (!string.IsNullOrEmpty(product.Image))
                    {
                        product.Image = $"http://{_config.GetValue<string>("Host")}/{AppConstants.ImageBaseFolder}/{AppConstants.ProductImageFolder}/{product.Image}";
                    }
                    product.IsExcluded = excludedProducts.Any(s => s.ProductId == product.Id);
                });
            }
            else
            {
                products.ForEach(product =>
                {
                    if (!string.IsNullOrEmpty(product.Image))
                    {
                        product.Image = $"http://{_config.GetValue<string>("Host")}/{AppConstants.ImageBaseFolder}/{AppConstants.ProductImageFolder}/{product.Image}";
                    }
                });
            }

            return products;
        }

        [HttpPost("api/products/{userId}")]
        public async Task ExcludeProduct([FromRoute] string userId, ExcludeProductDto model)
        {
            if (model != null)
            {
                var user = await _context.AppUsers.FirstOrDefaultAsync(s => s.UniqueId == userId);
                if (user == null)
                {
                    user = new User
                    {
                        UniqueId = userId,
                        IsActive = true,
                        DateCreated = DateTimeOffset.Now,
                        DateUpdated = DateTimeOffset.Now
                    };
                    _context.AppUsers.Add(user);
                    await _context.SaveChangesAsync();
                }

                var excludeProduct = await _context.ExcludeProducts.FirstOrDefaultAsync(s => s.UserId == user.Id && s.ProductId == model.ProductId);
                if (excludeProduct != null && !model.IsExcluded)
                {
                    _context.ExcludeProducts.Remove(excludeProduct);
                    await _context.SaveChangesAsync();
                }
                else if (excludeProduct == null && model.IsExcluded)
                {
                    _context.ExcludeProducts.Remove(new Data.Models.ExcludeProduct
                    {
                        UserId = user.Id,
                        ProductId = model.ProductId,
                        DateCreated = DateTimeOffset.Now
                    });
                    await _context.SaveChangesAsync();
                }
            }
        }

        [HttpGet("api/ilnesses")]
        public async Task<List<IllnessDto>> GetIlnesses()
        {
            var illnesses = await _context.Illnesses.Where(s => s.IsActive).OrderBy(s => s.Name).Select(s => new IllnessDto
            {
                Id = s.Id,
                Name = s.Name,
                MenuItems = new List<MenuItemDto>()
            }).ToListAsync();

            return illnesses;
        }

        [HttpPost("api/menus/{userId}")]
        public async Task CreateMenuItem([FromRoute] string userId, CreateMenuItemDto model)
        {
            if (model != null)
            {
                var user = await _context.AppUsers.FirstOrDefaultAsync(s => s.UniqueId == userId);
                if (user == null)
                {
                    user = new User
                    {
                        UniqueId = userId,
                        IsActive = true,
                        DateCreated = DateTimeOffset.Now,
                        DateUpdated = DateTimeOffset.Now
                    };
                    _context.AppUsers.Add(user);
                    await _context.SaveChangesAsync();
                }

                var menu = await _context.Menus.FirstOrDefaultAsync(s => s.UserId == user.Id && s.IllnessId == model.IllnessId);
                if (menu == null)
                {
                    menu = new Menu
                    {
                        UserId = user.Id,
                        IllnessId = model.IllnessId,
                        DateCreated = DateTimeOffset.Now,
                        DateUpdated = DateTimeOffset.Now
                    };
                    _context.Menus.Add(menu);
                    await _context.SaveChangesAsync();
                }

                _context.MenuItems.Add(new MenuItem
                {
                    Day = model.Day,
                    Hour = model.Hour,
                    MenuId = menu.Id,
                    RecipeId = model.RecipeId,
                    DateCreated = DateTimeOffset.Now,
                    DateUpdated= DateTimeOffset.Now
                });
                await _context.SaveChangesAsync();
            }
        }
    }

    public class CreateMenuItemDto
    {
        public int IllnessId { get; set; }
        public int Day { get; set; }
        public int Hour { get; set; }
        public int RecipeId { get; set; }
    }

    public class ExcludeProductDto
    {
        public int ProductId { get; set; }
        public bool IsExcluded { get; set; }
    }

    public class IllnessDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<MenuItemDto> MenuItems { get; set; } = new List<MenuItemDto>();
    }
    public class MenuItemDto
    {
        public int Id { get; set; }
        public int Day { get; set; }
        public int Hour { get; set; }
        public RecipeDto Recipe { get; set; }
    }

    public class RecipeDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Image { get; set; }
        public RecipeType Type { get; set; }
        public int Calories { get; set; }
        public List<ProductDto> Products { get; set; } = new List<ProductDto>();
        public List<CookingStepDto> CookingSteps { get; set; } = new List<CookingStepDto>();
    }

    public class ProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Image { get; set; }
        public int Calories { get; set; }
        public bool IsExcluded { get; set; }
        public List<string> AllowedFor { get; set; } = new List<string>();
        public List<string> ProhibitedFor { get; set; } = new List<string>();
    }

    public class CookingStepDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Image { get; set; }
    }
}
