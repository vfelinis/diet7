using Diet7.UI.Data;
using Diet7.UI.Data.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;

namespace Diet7.UI.Controllers
{
    public class AllowedProductsController : Controller
    {
        private readonly ApplicationDbContext _context;

        public AllowedProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: AllowedProducts
        public async Task<IActionResult> Index()
        {
            var applicationDbContext = _context.AllowedProducts.Include(a => a.Illness).Include(a => a.Product);
            return View(await applicationDbContext.ToListAsync());
        }

        // GET: AllowedProducts/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null || _context.AllowedProducts == null)
            {
                return NotFound();
            }

            var allowedProduct = await _context.AllowedProducts
                .Include(a => a.Illness)
                .Include(a => a.Product)
                .FirstOrDefaultAsync(m => m.Id == id);
            if (allowedProduct == null)
            {
                return NotFound();
            }

            return View(allowedProduct);
        }

        // GET: AllowedProducts/Create
        public IActionResult Create()
        {
            ViewData["IllnessId"] = new SelectList(_context.Illnesses, "Id", "Name");
            ViewData["ProductId"] = new SelectList(_context.Products, "Id", "Name");
            return View();
        }

        // POST: AllowedProducts/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("ProductId,IllnessId")] AllowedProduct allowedProduct)
        {
            if (ModelState.IsValid)
            {
                allowedProduct.DateCreated = DateTimeOffset.Now;
                _context.Add(allowedProduct);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            ViewData["IllnessId"] = new SelectList(_context.Illnesses, "Id", "Name", allowedProduct.IllnessId);
            ViewData["ProductId"] = new SelectList(_context.Products, "Id", "Name", allowedProduct.ProductId);
            return View(allowedProduct);
        }

        // GET: AllowedProducts/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null || _context.AllowedProducts == null)
            {
                return NotFound();
            }

            var allowedProduct = await _context.AllowedProducts.FindAsync(id);
            if (allowedProduct == null)
            {
                return NotFound();
            }
            ViewData["IllnessId"] = new SelectList(_context.Illnesses, "Id", "Name", allowedProduct.IllnessId);
            ViewData["ProductId"] = new SelectList(_context.Products, "Id", "Name", allowedProduct.ProductId);
            return View(allowedProduct);
        }

        // POST: AllowedProducts/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,ProductId,IllnessId")] AllowedProduct allowedProduct)
        {
            if (id != allowedProduct.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    var item = await _context.AllowedProducts.FindAsync(id);
                    if (item == null)
                    {
                        return NotFound();
                    }
                    item.ProductId = allowedProduct.ProductId;
                    item.IllnessId = allowedProduct.IllnessId;
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!AllowedProductExists(allowedProduct.Id))
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
            ViewData["IllnessId"] = new SelectList(_context.Illnesses, "Id", "Name", allowedProduct.IllnessId);
            ViewData["ProductId"] = new SelectList(_context.Products, "Id", "Name", allowedProduct.ProductId);
            return View(allowedProduct);
        }

        // GET: AllowedProducts/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null || _context.AllowedProducts == null)
            {
                return NotFound();
            }

            var allowedProduct = await _context.AllowedProducts
                .Include(a => a.Illness)
                .Include(a => a.Product)
                .FirstOrDefaultAsync(m => m.Id == id);
            if (allowedProduct == null)
            {
                return NotFound();
            }

            return View(allowedProduct);
        }

        // POST: AllowedProducts/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            if (_context.AllowedProducts == null)
            {
                return Problem("Entity set 'ApplicationDbContext.AllowedProducts'  is null.");
            }
            var allowedProduct = await _context.AllowedProducts.FindAsync(id);
            if (allowedProduct != null)
            {
                _context.AllowedProducts.Remove(allowedProduct);
            }
            
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool AllowedProductExists(int id)
        {
          return _context.AllowedProducts.Any(e => e.Id == id);
        }
    }
}
