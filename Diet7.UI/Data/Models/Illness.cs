namespace Diet7.UI.Data.Models
{
    public class Illness
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; }
        public DateTimeOffset DateCreated { get; set; }
        public DateTimeOffset DateUpdated { get; set; }

        public List<ProhibitedProduct> ProhibitedProducts { get; set; } = new();
        public List<AllowedProduct> AllowedProducts { get; set; } = new();
        public List<Menu> Menus { get; set; } = new();
    }
}
