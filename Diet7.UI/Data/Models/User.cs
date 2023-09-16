namespace Diet7.UI.Data.Models
{
    public class User
    {
        public int Id { get; set; }
        public string UniqueId { get; set; }
        public bool IsActive { get; set; }
        public DateTimeOffset DateCreated { get; set; }
        public DateTimeOffset DateUpdated{ get; set; }
        public List<ExcludeProduct> ExcludeProducts { get; set; }
    }
}
