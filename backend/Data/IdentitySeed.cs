using Microsoft.AspNetCore.Identity;
using InventoryMS.Models;

namespace InventoryMS.Data
{
    public static class IdentitySeed
    {
        public static async Task SeedAsync(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            // Create roles
            string[] roles = { "Admin", "Staff" };
            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                    await roleManager.CreateAsync(new IdentityRole(role));
            }

            // Create default admin
            var adminEmail = "admin@gmail.com";
            if (await userManager.FindByEmailAsync(adminEmail) == null)
            {
                var admin = new ApplicationUser
                {
                    UserName = adminEmail,
                    Email = adminEmail,
                    FullName = "System Admin",
                    Role = "Admin",
                    EmailConfirmed = true
                };
                var result = await userManager.CreateAsync(admin, "Admin@123");
                if (result.Succeeded)
                    await userManager.AddToRoleAsync(admin, "Admin");
            }

            // Create default staff
            var staffEmail = "staff@gmail.com";
            if (await userManager.FindByEmailAsync(staffEmail) == null)
            {
                var staff = new ApplicationUser
                {
                    UserName = staffEmail,
                    Email = staffEmail,
                    FullName = "Default Staff",
                    Role = "Staff",
                    EmailConfirmed = true
                };
                var result = await userManager.CreateAsync(staff, "Staff@123");
                if (result.Succeeded)
                    await userManager.AddToRoleAsync(staff, "Staff");
            }
        }
    }
}
