using Diet7.UI.Constants;
using Diet7.UI.Data;
using Diet7.UI.Data.Models;
using Diet7.UI.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;

namespace Diet7.UI.Controllers
{
    [Authorize]
    public class CookingStepsController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _env;

        public CookingStepsController(ApplicationDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // GET: CookingSteps
        public async Task<IActionResult> Index()
        {
            var applicationDbContext = _context.CookingSteps.Include(c => c.Recipe);
            return View(await applicationDbContext.OrderBy(s => s.Recipe.Name).ThenBy(s => s.Order).ToListAsync());
        }

        // GET: CookingSteps/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null || _context.CookingSteps == null)
            {
                return NotFound();
            }

            var cookingStep = await _context.CookingSteps
                .Include(c => c.Recipe)
                .FirstOrDefaultAsync(m => m.Id == id);
            if (cookingStep == null)
            {
                return NotFound();
            }

            return View(cookingStep);
        }

        // GET: CookingSteps/Create
        public IActionResult Create()
        {
            ViewData["RecipeId"] = new SelectList(_context.Recipes, "Id", "Name");
            return View();
        }

        // POST: CookingSteps/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(CreateCookingStepViewModel model)
        {
            if (ModelState.IsValid)
            {
                var cookingStep = new CookingStep
                {
                    Name = model.Name,
                    Description = model.Description,
                    Order = model.Order,
                    DateCreated = DateTimeOffset.Now,
                    DateUpdated = DateTimeOffset.Now,
                    RecipeId = model.RecipeId
                };
                _context.Add(cookingStep);
                await _context.SaveChangesAsync();

                if (model.Image != null)
                {
                    cookingStep.Image = $"{cookingStep.Id}{System.IO.Path.GetExtension(model.Image.FileName)}";
                    var path = System.IO.Path.Combine(AppConstants.ImageBasePath, AppConstants.ImageBaseFolder, AppConstants.CookingStepImageFolder, cookingStep.Image);
                    using var stream = new System.IO.FileStream(path, FileMode.OpenOrCreate);
                    model.Image.CopyTo(stream);

                    await _context.SaveChangesAsync();
                }
                return RedirectToAction(nameof(Index));
            }
            ViewData["RecipeId"] = new SelectList(_context.Recipes, "Id", "Name", model.RecipeId);
            return View(model);
        }

        // GET: CookingSteps/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null || _context.CookingSteps == null)
            {
                return NotFound();
            }

            var cookingStep = await _context.CookingSteps.FindAsync(id);
            if (cookingStep == null)
            {
                return NotFound();
            }
            ViewData["RecipeId"] = new SelectList(_context.Recipes, "Id", "Name", cookingStep.RecipeId);
            return View(cookingStep);
        }

        // POST: CookingSteps/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, UpdateCookingStepViewModel model)
        {
            if (id != model.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    var cookingStep = await _context.CookingSteps.FirstOrDefaultAsync(s => s.Id == model.Id);
                    if (cookingStep == null)
                    {
                        return NotFound();
                    }

                    cookingStep.Name = model.Name;
                    cookingStep.Description = model.Description;
                    cookingStep.Order = model.Order;
                    cookingStep.RecipeId = model.RecipeId;
                    cookingStep.DateUpdated = DateTimeOffset.Now;

                    if (model.IsDeleteImage)
                    {
                        cookingStep.Image = null;
                    }
                    else if (model.Image != null)
                    {
                        cookingStep.Image = $"{cookingStep.Id}{System.IO.Path.GetExtension(model.Image.FileName)}";
                        var path = System.IO.Path.Combine(AppConstants.ImageBasePath, AppConstants.ImageBaseFolder, AppConstants.CookingStepImageFolder, cookingStep.Image);
                        using var stream = new System.IO.FileStream(path, FileMode.OpenOrCreate);
                        model.Image.CopyTo(stream);
                    }

                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!CookingStepExists(model.Id))
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
            ViewData["RecipeId"] = new SelectList(_context.Recipes, "Id", "Name", model.RecipeId);
            return View(model);
        }

        // GET: CookingSteps/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null || _context.CookingSteps == null)
            {
                return NotFound();
            }

            var cookingStep = await _context.CookingSteps
                .Include(c => c.Recipe)
                .FirstOrDefaultAsync(m => m.Id == id);
            if (cookingStep == null)
            {
                return NotFound();
            }

            return View(cookingStep);
        }

        // POST: CookingSteps/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            if (_context.CookingSteps == null)
            {
                return Problem("Entity set 'ApplicationDbContext.CookingSteps'  is null.");
            }
            var cookingStep = await _context.CookingSteps.FindAsync(id);
            if (cookingStep != null)
            {
                _context.CookingSteps.Remove(cookingStep);
            }
            
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool CookingStepExists(int id)
        {
          return _context.CookingSteps.Any(e => e.Id == id);
        }
    }
}
