namespace Diet7.UI.Data.Models
{
    public class MenuItem
    {
        public int Id { get; set; }
        public int Day { get; set; }
        public int Hour { get; set; }
        public DateTimeOffset DateCreated { get; set; }
        public DateTimeOffset DateUpdated { get; set; }

        public int MenuId { get; set; }
        public Menu Menu { get; set; }

        public int RecipeId { get; set; }
        public Recipe Recipe { get; set; }
    }
}
