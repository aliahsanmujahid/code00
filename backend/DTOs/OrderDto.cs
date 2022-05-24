using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class OrderDto
    {
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
        public int Delivery  { get; set; }
        public int Subtotal { get; set; }
        public int Total { get; set; }
        public string Status { get; set; }
        public int Customer_id { get; set; }
        public int Seller_id { get; set; }
        public List<OrderItemDto> OrderItemDto { get; set; }

    }
}