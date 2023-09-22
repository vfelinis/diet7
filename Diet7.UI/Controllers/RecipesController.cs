using Diet7.UI.Constants;
using Diet7.UI.Data;
using Diet7.UI.Data.Models;
using Diet7.UI.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Diet7.UI.Controllers
{
    [Authorize]
    public class RecipesController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _env;

        public RecipesController(ApplicationDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // GET: Recipes
        public async Task<IActionResult> Index()
        {
            return View(await _context.Recipes.ToListAsync());
        }

        // GET: Recipes/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null || _context.Recipes == null)
            {
                return NotFound();
            }

            var recipe = await _context.Recipes
                .FirstOrDefaultAsync(m => m.Id == id);
            if (recipe == null)
            {
                return NotFound();
            }

            return View(recipe);
        }

        // GET: Recipes/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Recipes/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(CreateRecipeViewModel model)
        {
            if (ModelState.IsValid)
            {
                var recipe = new Recipe
                {
                    Name = model.Name,
                    Description = model.Description,
                    Calories = model.Calories,
                    IsActive = true,
                    Type = model.Type,
                    DateCreated = DateTimeOffset.Now,
                    DateUpdated = DateTimeOffset.Now
                };
                _context.Add(recipe);
                await _context.SaveChangesAsync();

                if (model.Image != null)
                {
                    recipe.Image = $"{recipe.Id}{System.IO.Path.GetExtension(model.Image.FileName)}";
                    var path = System.IO.Path.Combine(_env.WebRootPath, AppConstants.ImageBaseFolder, AppConstants.RecipeImageFolder, recipe.Image);
                    using var stream = new System.IO.FileStream(path, FileMode.OpenOrCreate);
                    model.Image.CopyTo(stream);

                    await _context.SaveChangesAsync();
                }
                return RedirectToAction(nameof(Index));
            }
            return View(model);
        }

        // GET: Recipes/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null || _context.Recipes == null)
            {
                return NotFound();
            }

            var recipe = await _context.Recipes.FindAsync(id);
            if (recipe == null)
            {
                return NotFound();
            }
            return View(new UpdateRecipeViewModel
            {
                Id = recipe.Id,
                Name = recipe.Name,
                Description = recipe.Description,
                Calories = recipe.Calories,
                IsActive = recipe.IsActive,
                Type = recipe.Type,
            });
        }

        // POST: Recipes/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, UpdateRecipeViewModel model)
        {
            if (id != model?.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    var recipe = await _context.Recipes.FirstOrDefaultAsync(s => s.Id == model.Id);
                    if (recipe == null)
                    {
                        return NotFound();
                    }

                    recipe.Name = model.Name;
                    recipe.Description = model.Description;
                    recipe.Calories = model.Calories;
                    recipe.IsActive = model.IsActive;
                    recipe.Type = model.Type;
                    recipe.DateUpdated = DateTimeOffset.Now;

                    if (model.IsDeleteImage)
                    {
                        recipe.Image = null;
                    }
                    else if (model.Image != null)
                    {
                        recipe.Image = $"{recipe.Id}{System.IO.Path.GetExtension(model.Image.FileName)}";
                        var path = System.IO.Path.Combine(_env.WebRootPath, AppConstants.ImageBaseFolder, AppConstants.RecipeImageFolder, recipe.Image);
                        using var stream = new System.IO.FileStream(path, FileMode.OpenOrCreate);
                        model.Image.CopyTo(stream);
                    }
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!RecipeExists(model.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            return View(model);
        }

        private bool RecipeExists(int id)
        {
            return _context.Recipes.Any(e => e.Id == id);
        }
    }
}
