require('dotenv').config();
var azure = require('azure-storage');
var fs  = require('fs');

if(process.env.AZURE_STORAGE_ACCOUNT && process.env.AZURE_STORAGE_ACCESS_KEY){
  //console.log(process.env.AZURE_STORAGE_ACCOUNT,process.env.AZURE_STORAGE_ACCESS_KEY);
}
else{
  console.log('No sufficient environment variables found');
  //process.exit(1);
}
var fileService = azure.createFileService(process.env.AZURE_STORAGE_ACCOUNT,process.env.AZURE_STORAGE_ACCESS_KEY);


// export default function uploadFileAzure (mdirectory,mfilepath){
var uploadFileAzure=function(mdirectory,mfilepath){
  fileService.createShareIfNotExists(mdirectory,function(error, result, response) {
    if (!error) {
      //console.log('worked fine',result,response);
      let uploadedFileName=mfilepath.split('/').pop();
      console.log(uploadedFileName);
      fileService.createFileFromLocalFile(mdirectory, '',uploadedFileName,mfilepath, function(error, result, response) {
        if (error) {
          // file uploaded
          console.log('error occured while uploading',error);
        }
        else{
          let newres=JSON.stringify(response);
          //console.log(newres);
          let newresjson=JSON.parse(newres);
          if(newresjson['isSuccessful']==true && newresjson['statusCode']==200){
            console.log('Uploaded successfully:',fileService.getUrl(mdirectory,'',uploadedFileName));
          }
          else{
            console.log('failed somewhere');
          }
        }
      });
    }
    else{
      console.log(error);
    }
  })
};


var downloadFileAzure=function(mdirectory,mFileName){

  fileService.getFileToStream(mdirectory, '', mFileName, fs.createWriteStream(mFileName), function(error, result, response) {
  if (!error) {
    //console.log(response);
    let newres=JSON.stringify(response);
    let newresjson=JSON.parse(newres);
    if(newresjson['isSuccessful']==true && newresjson['statusCode']==200){
      console.log('Downloaded successfully:');
    }
    else{
      console.log('failed somewhere');
    }

    // file retrieved
  }
  else{
    console.log(error);
    fs.unlink(mFileName,function(err){
      if(err){
        console.log(err);
      }
      else{
        //console.log('deleted successfully');
      }
    })
  }
});
};



module.exports  = {
  uploadFileAzure : uploadFileAzure,
  downloadFileAzure : downloadFileAzure
};

uploadFileAzure('newdir','/home/beyond/nodejs/samples/awss3try/dashboard_nervecenter.png');
downloadFileAzure('newdir','dashboard_nervecenter.png');
