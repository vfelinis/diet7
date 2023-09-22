using Diet7.UI.Data;
using Diet7.UI.Data.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Diet7.UI.Controllers
{
    public class IllnessesController : Controller
    {
        private readonly ApplicationDbContext _context;

        public IllnessesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: Illnesses
        public async Task<IActionResult> Index()
        {
              return View(await _context.Illnesses.ToListAsync());
        }

        // GET: Illnesses/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null || _context.Illnesses == null)
            {
                return NotFound();
            }

            var illness = await _context.Illnesses
                .FirstOrDefaultAsync(m => m.Id == id);
            if (illness == null)
            {
                return NotFound();
            }

            return View(illness);
        }

        // GET: Illnesses/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Illnesses/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Name,Description")] Illness illness)
        {
            if (ModelState.IsValid)
            {
                illness.IsActive = true;
                illness.DateCreated = DateTimeOffset.Now;
                illness.DateUpdated = DateTimeOffset.Now;
                _context.Add(illness);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(illness);
        }

        // GET: Illnesses/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null || _context.Illnesses == null)
            {
                return NotFound();
            }

            var illness = await _context.Illnesses.FindAsync(id);
            if (illness == null)
            {
                return NotFound();
            }
            return View(illness);
        }

        // POST: Illnesses/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,Name,Description,IsActive")] Illness illness)
        {
            if (id != illness.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    var item = await _context.Illnesses.FirstOrDefaultAsync(s => s.Id == illness.Id);
                    if (item == null)
                    {
                        return NotFound();
                    }
                    item.Name = illness.Name;
                    item.Description = illness.Description;
                    item.IsActive = illness.IsActive;
                    item.DateUpdated = DateTimeOffset.Now;
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!IllnessExists(illness.Id))
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
            return View(illness);
        }

        private bool IllnessExists(int id)
        {
          return _context.Illnesses.Any(e => e.Id == id);
        }
    }
}
