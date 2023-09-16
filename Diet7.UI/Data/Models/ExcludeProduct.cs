namespace Diet7.UI.Data.Models
{
    public class ExcludeProduct
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public Product Product { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public DateTimeOffset DateCreated { get; set; }
    }
}
