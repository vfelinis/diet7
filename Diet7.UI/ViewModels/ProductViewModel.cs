namespace Diet7.UI.ViewModels
{
    public class CreateProductViewModel
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public IFormFile Image { get; set; }
        public int Calories { get; set; }
    }

    public class UpdateProductViewModel: CreateProductViewModel
    {
        public int Id { get; set; }
        public bool IsActive { get; set; }
        public bool IsDeleteImage { get; set; }
    }
}
