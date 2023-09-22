namespace Diet7.UI.Data.Models
{
    public enum RecipeType
    {
        First = 0, Second = 1,
    }
    public class Recipe
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Image { get; set; }
        public RecipeType Type { get; set; }
        public int Calories { get; set; }
        public bool IsActive { get; set; }
        public DateTimeOffset DateCreated { get; set; }
        public DateTimeOffset DateUpdated { get; set; }
        public List<RecipeItem> RecipeItems { get; set; } = new();
        public List<CookingStep> CookingSteps { get; set; } = new();
        public List<MenuItem> MenuItems { get; set; } = new();
    }
}
