var express = require('express');
var router = express.Router();
require("dotenv").config();

const mendixplatformsdk = require("mendixplatformsdk");
const mendixmodelsdk = require("mendixmodelsdk");

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/getCountDetails', async function (req, res, next) {

  try {
    const mendixToken = req?.body?.mendixToken || "4jDFgmXgwUdjfqc2n8sYMEVyyx7usjw6oxJW2tNkC93XEWV1WuKKunEsdiV1yHXS9Zm7BaEG3WQco3Xnwnodxfmp7yjfJLQrwTBi";
    let projectId = req.body.projectId;
    let branchName;
    let numberOfEntites = 0;

    const client = new mendixplatformsdk.MendixPlatformClient();
    mendixplatformsdk.setPlatformConfig({
      mendixToken: mendixToken,
    });

    const app = client.getApp(projectId);

    const repository = app.getRepository();

    const repositoryInfo = await repository.getInfo();
    if (repositoryInfo.type === `svn`) {

      branchName = `trunk`;
    }
    else {

      branchName = `main`;
    }

    const workingCopy = await app.createTemporaryWorkingCopy(branchName);

    const model = await workingCopy.openModel();


    model.allDomainModels().forEach(domainModel => {
      numberOfEntites += domainModel.entities.length;
    });

    res.send({
      ApplicationDetails: {
        "Project Name": "name",
        "Project ID": projectId,
        "Entities": numberOfEntites,
        "Microflows": model.allMicroflows().length,
        "Pages": model.allPages().length,
        "Enumerations": model.allEnumerations().length,
        "Json Structures": model.allJsonStructures().length,
        "Published OData": model.allPublishedODataServices().length,
        "Published REST": model.allPublishedRestServices().length,
        "Published SOAP": model.allPublishedWebServices().length,
        "Published App Service": model.allPublishedAppServices().length,
        "Export Mappings": model.allExportMappings().length,
        "Imported WebServices": model.allImportedWebServices().length,
        "Imported Mappings": model.allImportMappings().length,
        "XML Schemas": model.allXmlSchemas().length,
        "Documents": model.allDocuments().length,
        "Document Templates": model.allDocumentTemplates().length,
        "Java Actions": model.allJavaActions().length,
        "Snippets": model.allSnippets().length,
        "Navigation Documents": model.allNavigationDocuments().length
      }
    }).status(200);

  } catch (error) {
    res.send({ error: error }).status(403);
  }



});

module.exports = router;
