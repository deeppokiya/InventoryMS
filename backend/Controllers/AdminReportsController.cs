using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InventoryMS.Data;
using InventoryMS.DTOs;

namespace InventoryMS.Controllers
{
    [ApiController]
    [Route("api/adminreports")]
    [Authorize(Roles = "Admin")]
    public class AdminReportsController : ControllerBase
    {
        private readonly InventoryContext _context;
        private const int LowStockThreshold = 10;

        public AdminReportsController(InventoryContext context)
        {
            _context = context;
        }

        // GET /api/adminreports/summary
        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary()
        {
            var products = await _context.Products.ToListAsync();

            var summary = new InventorySummaryDto
            {
                TotalProducts = products.Count,
                TotalStock = products.Sum(p => p.Quantity),
                TotalInventoryValue = products.Sum(p => p.Price * p.Quantity),
                LowStockCount = products.Count(p => p.Quantity > 0 && p.Quantity <= LowStockThreshold),
                OutOfStockCount = products.Count(p => p.Quantity == 0)
            };

            return Ok(summary);
        }

        // GET /api/adminreports/lowstock
        [HttpGet("lowstock")]
        public async Task<IActionResult> GetLowStock([FromQuery] int threshold = 10)
        {
            var products = await _context.Products
                .Where(p => p.Quantity <= threshold)
                .OrderBy(p => p.Quantity)
                .ToListAsync();

            return Ok(products);
        }

        // GET /api/adminreports/products
        [HttpGet("products")]
        public async Task<IActionResult> GetProductReport()
        {
            var products = await _context.Products
                .OrderBy(p => p.Category)
                .ThenBy(p => p.ProductName)
                .ToListAsync();

            var grouped = products
                .GroupBy(p => p.Category)
                .Select(g => new
                {
                    Category = g.Key,
                    Count = g.Count(),
                    TotalQuantity = g.Sum(p => p.Quantity),
                    TotalValue = g.Sum(p => p.Price * p.Quantity),
                    Products = g.ToList()
                });

            return Ok(grouped);
        }

        // GET /api/adminreports/categories
        [HttpGet("categories")]
        public async Task<IActionResult> GetCategoryStats()
        {
            var stats = await _context.Products
                .GroupBy(p => p.Category)
                .Select(g => new
                {
                    Category = g.Key,
                    ProductCount = g.Count(),
                    TotalQuantity = g.Sum(p => p.Quantity),
                    TotalValue = g.Sum(p => (double)(p.Price * p.Quantity)),
                    AvgPrice = g.Average(p => (double)p.Price)
                })
                .OrderByDescending(g => g.ProductCount)
                .ToListAsync();

            return Ok(stats);
        }
    }
}
