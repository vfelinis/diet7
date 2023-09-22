namespace Diet7.UI.ViewModels
{
    public class CreateCookingStepViewModel
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public IFormFile Image { get; set; }
        public int Order { get; set; }
        public int RecipeId { get; set; }
    }

    public class UpdateCookingStepViewModel : CreateCookingStepViewModel
    {
        public int Id { get; set; }
        public bool IsDeleteImage { get; set; }
    }
}
