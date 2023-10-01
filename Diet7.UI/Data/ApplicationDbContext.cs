using Diet7.UI.Data.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Diet7.UI.Data
{
    public class ApplicationDbContext : IdentityDbContext
    {
        public DbSet<User> AppUsers { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ExcludeProduct> ExcludeProducts { get; set; }
        public DbSet<Recipe> Recipes { get; set; }
        public DbSet<RecipeItem> RecipeItems { get; set; }
        public DbSet<CookingStep> CookingSteps { get; set; }
        public DbSet<Illness> Illnesses { get; set; }
        public DbSet<ProhibitedProduct> ProhibitedProducts { get; set; }
        public DbSet<AllowedProduct> AllowedProducts { get; set; }
        public DbSet<Menu> Menus { get; set; }
        public DbSet<MenuItem> MenuItems { get; set; }
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

            modelBuilder.Entity<Recipe>(s =>
            {
                s.Property(s => s.Name).IsRequired(true).HasMaxLength(250);
                s.HasIndex(x => x.Name).IsUnique(true);
            });

            modelBuilder.Entity<RecipeItem>(s =>
            {
                s.HasIndex(x => new { x.RecipeId, x.ProductId }).IsUnique(true);
            });

            modelBuilder.Entity<CookingStep>(s =>
            {
                s.Property(s => s.Name).IsRequired(true).HasMaxLength(250);
                s.HasIndex(x => new { x.RecipeId, x.Name }).IsUnique(true);
            });

            modelBuilder.Entity<Illness>(s =>
            {
                s.Property(s => s.Name).IsRequired(true).HasMaxLength(250);
                s.HasIndex(x => x.Name).IsUnique(true);
            });

            modelBuilder.Entity<ProhibitedProduct>(s =>
            {
                s.HasIndex(x => new { x.IllnessId, x.ProductId }).IsUnique(true);
            });

            modelBuilder.Entity<AllowedProduct>(s =>
            {
                s.HasIndex(x => new { x.IllnessId, x.ProductId }).IsUnique(true);
            });

            modelBuilder.Entity<Menu>(s =>
            {
                s.HasIndex(x => new { x.UserId, x.IllnessId }).IsUnique(true);
            });
        }
    }
}