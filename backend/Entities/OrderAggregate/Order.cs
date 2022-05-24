using System;
using System.Collections.Generic;

namespace Core.Entities.OrderAggregate
{
    public class Order 
    {
        public int Id { get; set; }
        public int Randnum { get; set; }
        public string Name { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public string District { get; set; }
        public string Upazila { get; set; }
        public string CashOnDelevary { get; set; }
        public string Bkash { get; set; }
        public string BkashTransactionID { get; set; }
        public string Rocket { get; set; }
        public string RocketTransactionID { get; set; }
        public string Nagad { get; set; }
        public string NagadTransactionID { get; set; }
        public DateTimeOffset OrderDate { get; set; } = DateTimeOffset.Now;
        public int Delivery  { get; set; }
        public int Subtotal { get; set; }
        public int Total { get; set; }
        public string Status { get; set; } 
        public int Customer_id { get; set; }
        public int Seller_id { get; set; }
        public IReadOnlyList<OrderItem> OrderItems { get; set; }
        public int GetTotal()
        {
            return Subtotal + Delivery;
        }
    }
}