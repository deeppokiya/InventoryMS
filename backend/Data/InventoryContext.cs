using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using InventoryMS.Models;

namespace InventoryMS.Data
{
    public class InventoryContext : IdentityDbContext<ApplicationUser>
    {
        public InventoryContext(DbContextOptions<InventoryContext> options) : base(options) { }

        public DbSet<Product> Products { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Product>(entity =>
            {
                entity.HasKey(p => p.ProductId);
                entity.Property(p => p.Price).HasColumnType("decimal(18,2)");
                entity.Property(p => p.ProductName).IsRequired().HasMaxLength(200);
                entity.Property(p => p.Category).IsRequired().HasMaxLength(100);
            });
        }
    }
}
