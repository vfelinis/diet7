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
    public class ProductsController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _env;

        public ProductsController(ApplicationDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // GET: Products
        public async Task<IActionResult> Index()
        {
              return View(await _context.Products.ToListAsync());
        }

        // GET: Products/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null || _context.Products == null)
            {
                return NotFound();
            }

            var product = await _context.Products
                .FirstOrDefaultAsync(m => m.Id == id);
            if (product == null)
            {
                return NotFound();
            }

            return View(product);
        }

        // GET: Products/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Products/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(CreateProductViewModel model)
        {
            if (ModelState.IsValid)
            {
                var product = new Product
                {
                    Name = model.Name,
                    Description = model.Description,
                    Calories = model.Calories,
                    IsActive = true,
                    DateCreated = DateTimeOffset.Now,
                    DateUpdated = DateTimeOffset.Now
                };
                _context.Add(product);
                await _context.SaveChangesAsync();

                if (model.Image != null)
                {
                    product.Image = $"{product.Id}{System.IO.Path.GetExtension(model.Image.FileName)}";
                    var path = System.IO.Path.Combine(_env.WebRootPath, AppConstants.ImageBaseFolder, AppConstants.ProductImageFolder, product.Image);
                    using var stream = new System.IO.FileStream(path, FileMode.OpenOrCreate);
                    model.Image.CopyTo(stream);

                    await _context.SaveChangesAsync();
                }

                return RedirectToAction(nameof(Index));
            }
            return View(model);
        }

        // GET: Products/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null || _context.Products == null)
            {
                return NotFound();
            }

            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }
            var model = new UpdateProductViewModel
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Calories = product.Calories,
                IsActive = product.IsActive
            };
            return View(model);
        }

        // POST: Products/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, UpdateProductViewModel model)
        {
            if (id != model?.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    var product = await _context.Products.FirstOrDefaultAsync(s => s.Id == model.Id);
                    if (product == null)
                    {
                        return NotFound();
                    }

                    product.Name = model.Name;
                    product.Description = model.Description;
                    product.Calories = model.Calories;
                    product.IsActive = model.IsActive;
                    product.DateUpdated = DateTimeOffset.Now;

                    if (model.IsDeleteImage)
                    {
                        product.Image = null;
                    }
                    else if (model.Image != null)
                    {
                        product.Image = $"{product.Id}{System.IO.Path.GetExtension(model.Image.FileName)}";
                        var path = System.IO.Path.Combine(_env.WebRootPath, AppConstants.ImageBaseFolder, AppConstants.ProductImageFolder, product.Image);
                        using var stream = new System.IO.FileStream(path, FileMode.OpenOrCreate);
                        model.Image.CopyTo(stream);
                    }
                    
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!ProductExists(model.Id))
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

        private bool ProductExists(int id)
        {
          return _context.Products.Any(e => e.Id == id);
        }
    }
}
