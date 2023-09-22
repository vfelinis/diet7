namespace Diet7.UI.Data.Models
{
    public class AllowedProduct
    {
        public int Id { get; set; }
        public DateTimeOffset DateCreated { get; set; }

        public int ProductId { get; set; }
        public Product Product { get; set; }

        public int IllnessId { get; set; }
        public Illness Illness { get; set; }
    }
}
