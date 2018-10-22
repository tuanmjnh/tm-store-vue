export function getMetaFile(path, firebase) {
  return new Promise((resolve, reject) => {
    var storageRef = firebase.storage().ref();
    // Create a reference to the file whose metadata we want to retrieve
    var forestRef = storageRef.child(path);
    // Get metadata properties
    forestRef.getMetadata().then(function(metadata) {
      // console.log(metadata)
      resolve(metadata)
      // Metadata now contains the metadata for 'images/forest.jpg'
    }).catch(function(error) {
      console.log(error)
      // Uh-oh, an error occurred!
    });
  })
}
export function getDownloadURL(path, firebase) {
  var storageRef = firebase.storage().ref();
  // Create a reference to the file we want to download
  var starsRef = storageRef.child(path);
  // Get the download URL
  starsRef.getDownloadURL().then(function(url) {
    // Insert url into an <img> tag to "download"
  }).catch(function(error) {
    // A full list of error codes is available at
    // https://firebase.google.com/docs/storage/web/handle-errors
    switch (error.code) {
      case 'storage/object-not-found':
        // File doesn't exist
        break;
      case 'storage/unauthorized':
        // User doesn't have permission to access the object
        break;
      case 'storage/canceled':
        // User canceled the upload
        break;
      case 'storage/unknown':
        // Unknown error occurred, inspect the server response
        break;
    }
  });
}
