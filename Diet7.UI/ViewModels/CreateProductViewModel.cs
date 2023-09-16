using Diet7.UI.Data.Models;

namespace Diet7.UI.ViewModels
{
    public class CreateProductViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public IFormFile Image { get; set; }
        public int Calories { get; set; }
    }
}
