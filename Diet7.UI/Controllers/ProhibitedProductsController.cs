using Diet7.UI.Data;
using Diet7.UI.Data.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;

namespace Diet7.UI.Controllers
{
    [Authorize]
    public class ProhibitedProductsController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ProhibitedProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: ProhibitedProducts
        public async Task<IActionResult> Index()
        {
            var applicationDbContext = _context.ProhibitedProducts.Include(p => p.Illness).Include(p => p.Product);
            return View(await applicationDbContext.OrderBy(s => s.Illness.Name).ThenBy(s => s.Product.Name).ToListAsync());
        }

        // GET: ProhibitedProducts/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null || _context.ProhibitedProducts == null)
            {
                return NotFound();
            }

            var prohibitedProduct = await _context.ProhibitedProducts
                .Include(p => p.Illness)
                .Include(p => p.Product)
                .FirstOrDefaultAsync(m => m.Id == id);
            if (prohibitedProduct == null)
            {
                return NotFound();
            }

            return View(prohibitedProduct);
        }

        // GET: ProhibitedProducts/Create
        public IActionResult Create()
        {
            ViewData["IllnessId"] = new SelectList(_context.Illnesses, "Id", "Name");
            ViewData["ProductId"] = new SelectList(_context.Products, "Id", "Name");
            return View();
        }

        // POST: ProhibitedProducts/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("ProductId,IllnessId")] ProhibitedProduct prohibitedProduct)
        {
            if (ModelState.IsValid)
            {
                if (await _context.AllowedProducts.AnyAsync(s => s.IllnessId == prohibitedProduct.IllnessId && s.ProductId == prohibitedProduct.ProductId))
                {
                    ModelState.AddModelError("", "Продукт уже добавлен в качестве разрешенного.");
                }
                else
                {
                    prohibitedProduct.DateCreated = DateTimeOffset.Now;
                    _context.Add(prohibitedProduct);
                    await _context.SaveChangesAsync();
                    return RedirectToAction(nameof(Index));
                }
            }
            ViewData["IllnessId"] = new SelectList(_context.Illnesses, "Id", "Name", prohibitedProduct.IllnessId);
            ViewData["ProductId"] = new SelectList(_context.Products, "Id", "Name", prohibitedProduct.ProductId);
            return View(prohibitedProduct);
        }

        // GET: ProhibitedProducts/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null || _context.ProhibitedProducts == null)
            {
                return NotFound();
            }

            var prohibitedProduct = await _context.ProhibitedProducts.FindAsync(id);
            if (prohibitedProduct == null)
            {
                return NotFound();
            }
            ViewData["IllnessId"] = new SelectList(_context.Illnesses, "Id", "Name", prohibitedProduct.IllnessId);
            ViewData["ProductId"] = new SelectList(_context.Products, "Id", "Name", prohibitedProduct.ProductId);
            return View(prohibitedProduct);
        }

        // POST: ProhibitedProducts/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,ProductId,IllnessId")] ProhibitedProduct prohibitedProduct)
        {
            if (id != prohibitedProduct.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    var item = await _context.ProhibitedProducts.FindAsync(id);
                    if (item == null)
                    {
                        return NotFound();
                    }
                    if (await _context.AllowedProducts.AnyAsync(s => s.IllnessId == prohibitedProduct.IllnessId && s.ProductId == prohibitedProduct.ProductId))
                    {
                        ModelState.AddModelError("", "Продукт уже добавлен в качестве разрешенного.");
                    }
                    else
                    {
                        item.ProductId = prohibitedProduct.ProductId;
                        item.IllnessId = prohibitedProduct.IllnessId;
                        await _context.SaveChangesAsync();
                        return RedirectToAction(nameof(Index));
                    }
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!ProhibitedProductExists(prohibitedProduct.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
            }
            ViewData["IllnessId"] = new SelectList(_context.Illnesses, "Id", "Name", prohibitedProduct.IllnessId);
            ViewData["ProductId"] = new SelectList(_context.Products, "Id", "Name", prohibitedProduct.ProductId);
            return View(prohibitedProduct);
        }

        // GET: ProhibitedProducts/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null || _context.ProhibitedProducts == null)
            {
                return NotFound();
            }

            var prohibitedProduct = await _context.ProhibitedProducts
                .Include(p => p.Illness)
                .Include(p => p.Product)
                .FirstOrDefaultAsync(m => m.Id == id);
            if (prohibitedProduct == null)
            {
                return NotFound();
            }

            return View(prohibitedProduct);
        }

        // POST: ProhibitedProducts/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            if (_context.ProhibitedProducts == null)
            {
                return Problem("Entity set 'ApplicationDbContext.ProhibitedProducts'  is null.");
            }
            var prohibitedProduct = await _context.ProhibitedProducts.FindAsync(id);
            if (prohibitedProduct != null)
            {
                _context.ProhibitedProducts.Remove(prohibitedProduct);
            }
            
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool ProhibitedProductExists(int id)
        {
          return _context.ProhibitedProducts.Any(e => e.Id == id);
        }
    }
}
