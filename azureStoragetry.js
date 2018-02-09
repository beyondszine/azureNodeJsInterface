require('dotenv').config();
var azure = require('azure-storage');

if(process.env.AZURE_STORAGE_ACCOUNT && process.env.AZURE_STORAGE_ACCESS_KEY){
  console.log(process.env.AZURE_STORAGE_ACCOUNT,process.env.AZURE_STORAGE_ACCESS_KEY);
}
else{
  console.log('No sufficient environemtn variables found');
}
var fileService = azure.createFileService(process.env.AZURE_STORAGE_ACCOUNT,process.env.AZURE_STORAGE_ACCESS_KEY);

fileService.createShareIfNotExists('taskshare',function(error, result, response) {
  if (!error) {
    console.log('worked fine',result,response);
    fileService.createFileFromLocalFile('taskshare', '','cam_config.png','cam_config.png', function(error, result, response) {
      if (error) {
        // file uploaded
        console.log('error occured whiel uploading',error);
      }
      else{
        console.log(result);
        console.log(response);
      }
    });
  }
  else{
    console.log(error);
  }
});


console.log(fileService.getUrl('taskshare','','cam_config.png'));

// fileService.getShareAcl('taskshare',function(err,res){
//   if(err){
//     console.log('error occured',err);
//   }
//   else{
//     console.log(res);
//   }
// });
