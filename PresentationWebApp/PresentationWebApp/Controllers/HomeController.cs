using CloudinaryManager;
using DatabaseManager;
using DatabaseManager.Models;
using System;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using PresentationWebApp.Models;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace PresentationWebApp.Controllers
{
    public class HomeController : Controller
    {
        private CloudinaryManagerEx cloudinaryManager = new CloudinaryManagerEx("cerber", "663363588731661", "-quDCRtMI_3VP9SN2GaAIsHxCh0");

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        [HttpGet]
        [Authorize]
        public ActionResult Manager(String url)
        {
            ManagerModel model;
            List<PresentationExModel> presentation;
            CreateManagerModel(out model, out presentation);
            if (url != null)
            {
                foreach (var a in presentation)
                    if (a.PathBeginPhoto.Equals(url))
                    {
                        model.Present = a.Photos;

                        return Json(JsonConvert.SerializeObject(model.Present), JsonRequestBehavior.AllowGet);
                    }
            }

            return View(model);
        }

        [HttpPost]
        [Authorize]
        public ActionResult Upload()
        {
            UploadFile();

            ManagerModel model;
            List<PresentationExModel> presentation;
            CreateManagerModel(out model, out presentation);

            return View("Manager", model);
        }

        [HttpPost]
        [Authorize]
        public ActionResult UploadEx(String url)
        {
            String guid = UploadFileEx(url);

            var photos = DatabaseContextManager.GetPhotosUserNotPresentation(User.Identity.GetUserId());

            foreach (var a in photos)
            {
                if (a.PhotoId.Equals(guid))
                {
                    return Json(JsonConvert.SerializeObject(a), JsonRequestBehavior.AllowGet);
                }
            }

            return View("Manager");

        }

        [HttpPost]
        [Authorize]
        public ActionResult Present()
        {
            CreatePresent();

            ManagerModel model;
            List<PresentationExModel> presentation;
            CreateManagerModel(out model, out presentation);

            return View("Manager", model);
        }

        private void CreateManagerModel(out ManagerModel model, out List<PresentationExModel> presentation)
        {
            model = new ManagerModel();
            model.UserFloatPhotos = DatabaseContextManager.GetPhotosUserNotPresentation(User.Identity.GetUserId());

            presentation = DatabaseContextManager.GetAllPresentation();

            model.PathBeginPhoto = new List<string>();
            foreach (var a in presentation)
                model.PathBeginPhoto.Add(a.PathBeginPhoto);

            model.Present = new List<PhotoModel>();
        }

        private void UploadFile()
        {
            foreach (string upload in Request.Files)
            {
                if (Request.Files[upload] == null) continue;

                String guid = System.Guid.NewGuid().ToString();
                DatabaseContextManager.AddPhoto(new PhotoModel()
                {
                    PhotoId = guid,
                    UserId = User.Identity.GetUserId(),
                    PhotoPath = cloudinaryManager.UploadImage(Request.Files[upload].FileName, Request.Files[upload].InputStream, guid),
                    PhotoName = "",
                    PhotoDescription = ""
                });
            }
        }

        private string UploadFileEx(String url)
        {
            String guid = System.Guid.NewGuid().ToString();
            DatabaseContextManager.AddPhoto(new PhotoModel()
            {
                PhotoId = guid,
                UserId = User.Identity.GetUserId(),
                PhotoPath = cloudinaryManager.UploadImage(url, guid),
                PhotoName = "",
                PhotoDescription = ""
            });
            return guid;
        }

        private void CreatePresent()
        {
            var presentId = System.Guid.NewGuid().ToString();
            var userId = User.Identity.GetUserId();
            var list = Request.Form.AllKeys;
            var photos = DatabaseContextManager.GetPhotosUserNotPresentation(User.Identity.GetUserId());
            var present = new PresentationExModel();
            present.PresentationId = presentId;
            present.UserId = userId;

            int index = 0;
            foreach (var a in list)
            {
                foreach (var b in photos)
                {
                    if (Request.Form[a].Equals(b.PhotoId))
                    {
                        if (index == 0)
                        {
                            present.PathBeginPhoto = DatabaseContextManager.GetPathPhoto(b.PhotoId);
                        }

                        b.PresentationId = presentId;
                        b.PositionNumber = index;
                        index++;
                    }
                }
            }

            present.Photos = photos;
            DatabaseContextManager.AddPresentation(present);
        }
    }
}