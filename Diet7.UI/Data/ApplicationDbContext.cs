using Diet7.UI.Data.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Diet7.UI.Data
{
    public class ApplicationDbContext : IdentityDbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ExcludeProduct> ExcludeProducts { get; set; }
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // использование Fluent API
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>(s =>
            {
                s.Property(s => s.UniqueId).IsRequired(true).HasMaxLength(250);
                s.HasIndex(x => x.UniqueId).IsUnique(true);
            });

            modelBuilder.Entity<Product>(s =>
            {
                s.Property(s => s.Name).IsRequired(true).HasMaxLength(250);
                s.HasIndex(x => x.Name).IsUnique(true);
            });

            modelBuilder.Entity<ExcludeProduct>(s =>
            {
                s.HasOne(x => x.User).WithMany(x => x.ExcludeProducts).HasForeignKey(x => x.UserId);
                s.HasOne(x => x.Product).WithMany(x => x.ExcludeProducts).HasForeignKey(x => x.ProductId);
            });
        }
    }
}