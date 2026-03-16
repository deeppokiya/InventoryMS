using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InventoryMS.DTOs;
using InventoryMS.Models;

namespace InventoryMS.Controllers
{
    [ApiController]
    [Route("api/adminstaff")]
    [Authorize(Roles = "Admin")]
    public class AdminStaffController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public AdminStaffController(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        // GET /api/adminstaff
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var staffUsers = await _userManager.Users
                .Where(u => u.Role == "Staff")
                .OrderBy(u => u.FullName)
                .ToListAsync();

            var result = staffUsers.Select(u => new StaffResponseDto
            {
                Id = u.Id,
                FullName = u.FullName,
                Email = u.Email!,
                Role = u.Role,
                CreatedAt = u.CreatedAt
            });

            return Ok(result);
        }

        // GET /api/adminstaff/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null || user.Role != "Staff")
                return NotFound(new { message = "Staff member not found." });

            return Ok(new StaffResponseDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email!,
                Role = user.Role,
                CreatedAt = user.CreatedAt
            });
        }

        // POST /api/adminstaff
        [HttpPost]
        public async Task<IActionResult> CreateStaff([FromBody] CreateStaffDto dto)
        {
            var existing = await _userManager.FindByEmailAsync(dto.Email);
            if (existing != null)
                return BadRequest(new { message = "Email already in use." });

            var user = new ApplicationUser
            {
                UserName = dto.Email,
                Email = dto.Email,
                FullName = dto.FullName,
                Role = "Staff",
                EmailConfirmed = true
            };

            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            await _userManager.AddToRoleAsync(user, "Staff");

            return CreatedAtAction(nameof(GetById), new { id = user.Id }, new StaffResponseDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email!,
                Role = user.Role,
                CreatedAt = user.CreatedAt
            });
        }

        // DELETE /api/adminstaff/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStaff(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null || user.Role != "Staff")
                return NotFound(new { message = "Staff member not found." });

            await _userManager.DeleteAsync(user);
            return Ok(new { message = "Staff member removed." });
        }
    }
}
