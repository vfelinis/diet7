namespace Diet7.UI.Data.Models
{
    public class CookingStep
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Image { get; set; }
        public int Order { get; set; }
        public DateTimeOffset DateCreated { get; set; }
        public DateTimeOffset DateUpdated { get; set; }

        public int RecipeId { get; set; }
        public Recipe Recipe { get; set; }
    }
}
