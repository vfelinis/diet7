namespace Diet7.UI.Data.Models
{
    public class Menu
    {
        public int Id { get; set; }
        public DateTimeOffset DateCreated { get; set; }
        public DateTimeOffset DateUpdated { get; set; }

        public int IllnessId { get; set; }
        public Illness Illness { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }

        public List<MenuItem> MenuItems { get; set; } = new();
    }
}
