import {request, config} from 'utils'

export function uploadFile(options) {
  const data = new FormData();
  data.append("attachment", options.file);
  return request({
    url: "/api/file/upload",
    method: 'post',
    data:data,
    headers: {
      "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundaryqTqJIxvkWFYqvP5s",
      "X-Requested-With": "XMLHttpRequest"
    },

  })
}
