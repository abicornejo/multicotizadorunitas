import axios from 'axios';

//const host='http://127.0.0.1:8000';
const host='http://cotizadorunitasservices.itcodesolutions.com';

export class AnaService {

    wsListarMarcas() {
        return axios.get(`${host}/api/auth/wsListarMarcas`).then(res => {

            return res.data;
        });
    }
    wsListarSubMarcas(idMarca) {
        return axios.get(`${host}/api/auth/wsListarSubMarcas/${idMarca}`).then(res => {

            return res.data;
        });
    }
    wsListarModelos(idSubMarca) {
        return axios.get(`${host}/api/auth/wsListarModelos/${idSubMarca}`).then(res => {

            return res.data;
        });
    }
    wsListarVersiones(idSubMarca, idModelo) {
        return axios.get(`${host}/api/auth/wsListarVersiones?idSubmarca=${idSubMarca}&modelo=${idModelo}`).then(res => {

            return res.data;
        });
    }
}
