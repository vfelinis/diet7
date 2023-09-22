namespace Diet7.UI.Data.Models
{
    public class RecipeItem
    {
        public int Id { get; set; }
        public int Priority { get; set; }
        public DateTimeOffset DateCreated { get; set; }

        public int RecipeId { get; set; }
        public Recipe Recipe { get; set; }

        public int ProductId { get; set; }
        public Product Product { get; set; }
    }
}
