using DatabaseManager.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PresentationWebApp.Models
{
    public class ManagerModel
    {
        public List<PhotoModel> UserFloatPhotos { get; set; }
        public List<String> PathBeginPhoto { get; set; }
        public List<PhotoModel> Present { get; set; }
    }
}