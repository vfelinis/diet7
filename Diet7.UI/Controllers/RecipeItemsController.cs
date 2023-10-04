using Diet7.UI.Data;
using Diet7.UI.Data.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;

namespace Diet7.UI.Controllers
{
    [Authorize]
    public class RecipeItemsController : Controller
    {
        private readonly ApplicationDbContext _context;

        public RecipeItemsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: RecipeItems
        public async Task<IActionResult> Index()
        {
            var applicationDbContext = _context.RecipeItems.Include(r => r.Product).Include(r => r.Recipe);
            return View(await applicationDbContext.OrderBy(s => s.Recipe.Name).ThenBy(s => s.Product.Name).ToListAsync());
        }

        // GET: RecipeItems/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null || _context.RecipeItems == null)
            {
                return NotFound();
            }

            var recipeItem = await _context.RecipeItems
                .Include(r => r.Product)
                .Include(r => r.Recipe)
                .FirstOrDefaultAsync(m => m.Id == id);
            if (recipeItem == null)
            {
                return NotFound();
            }

            return View(recipeItem);
        }

        // GET: RecipeItems/Create
        public IActionResult Create()
        {
            ViewData["ProductId"] = new SelectList(_context.Products, "Id", "Name");
            ViewData["RecipeId"] = new SelectList(_context.Recipes, "Id", "Name");
            return View();
        }

        // POST: RecipeItems/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Priority,RecipeId,ProductId")] RecipeItem recipeItem)
        {
            if (ModelState.IsValid)
            {
                recipeItem.DateCreated = DateTimeOffset.Now;
                _context.Add(recipeItem);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            ViewData["ProductId"] = new SelectList(_context.Products, "Id", "Name", recipeItem.ProductId);
            ViewData["RecipeId"] = new SelectList(_context.Recipes, "Id", "Name", recipeItem.RecipeId);
            return View(recipeItem);
        }

        // GET: RecipeItems/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null || _context.RecipeItems == null)
            {
                return NotFound();
            }

            var recipeItem = await _context.RecipeItems.FindAsync(id);
            if (recipeItem == null)
            {
                return NotFound();
            }
            ViewData["ProductId"] = new SelectList(_context.Products, "Id", "Name", recipeItem.ProductId);
            ViewData["RecipeId"] = new SelectList(_context.Recipes, "Id", "Name", recipeItem.RecipeId);
            return View(recipeItem);
        }

        // POST: RecipeItems/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,Priority,RecipeId,ProductId")] RecipeItem recipeItem)
        {
            if (id != recipeItem.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    recipeItem.DateCreated = DateTimeOffset.Now;
                    _context.Update(recipeItem);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!RecipeItemExists(recipeItem.Id))
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
            ViewData["ProductId"] = new SelectList(_context.Products, "Id", "Name", recipeItem.ProductId);
            ViewData["RecipeId"] = new SelectList(_context.Recipes, "Id", "Name", recipeItem.RecipeId);
            return View(recipeItem);
        }

        // GET: RecipeItems/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null || _context.RecipeItems == null)
            {
                return NotFound();
            }

            var recipeItem = await _context.RecipeItems
                .Include(r => r.Product)
                .Include(r => r.Recipe)
                .FirstOrDefaultAsync(m => m.Id == id);
            if (recipeItem == null)
            {
                return NotFound();
            }

            return View(recipeItem);
        }

        // POST: RecipeItems/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            if (_context.RecipeItems == null)
            {
                return Problem("Entity set 'ApplicationDbContext.RecipeItems'  is null.");
            }
            var recipeItem = await _context.RecipeItems.FindAsync(id);
            if (recipeItem != null)
            {
                _context.RecipeItems.Remove(recipeItem);
            }
            
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool RecipeItemExists(int id)
        {
          return _context.RecipeItems.Any(e => e.Id == id);
        }
    }
}
