import cookie from 'react-cookies';

const base = process.env.REACT_APP_ADMIN_SERVER_URL;

export const logoutFunction = (event)=>{
  fetch(base+`/api/user-logout/?id=${event}` , {
    method: "get"
  })
  .then((result) => result.json())
  .then((info) => {
    if (info.success == true) {
      console.log('Success : ', info.success);

      localStorage.clear();

      cookie.remove('token');
      cookie.remove('issuedAt');
      cookie.remove('expiresIn');
      cookie.remove('userId');

      setTimeout(
        function() {
          window.location = '/login';
        }
        .bind(this),
        1000
      );
    }
    else {
      console.log(info.success);

      localStorage.clear();

      cookie.remove('token');
      cookie.remove('issuedAt');
      cookie.remove('expiresIn');
      cookie.remove('userId');

      setTimeout(
        function() {
          window.location = '/login';
        }
        .bind(this),
        1000
      );
    }

  })
}
