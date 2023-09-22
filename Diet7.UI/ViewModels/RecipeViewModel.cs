using Diet7.UI.Data.Models;

namespace Diet7.UI.ViewModels
{
    public class CreateRecipeViewModel
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public IFormFile Image { get; set; }
        public int Calories { get; set; }
        public RecipeType Type { get; set; }
    }

    public class UpdateRecipeViewModel : CreateRecipeViewModel
    {
        public int Id { get; set; }
        public bool IsDeleteImage { get; set; }
        public bool IsActive { get; set; }
    }
}
