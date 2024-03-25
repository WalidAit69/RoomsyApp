import ImagePicker, { ImagePickerResponse } from "react-native-image-picker";

const launchImageLibrary = (options: any): Promise<ImagePickerResponse> => {
  return new Promise((resolve, reject) => {
    ImagePicker.launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.errorMessage) {
        reject(response.errorMessage);
      } else if (response.didCancel) {
        reject("User cancelled image picker");
      } else {
        resolve(response);
      }
    });
  });
};

export default launchImageLibrary;
