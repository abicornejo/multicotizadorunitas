import axios from 'axios';
const host='https://www.afirmeseguros.com/gateway/catalogs';

export class AfirmeService {

    getTokenAfirme() {
        const params = new URLSearchParams()
        params.append('grant_type', 'password')
        params.append('username', 'erojaslara@unitas.mx')
        params.append('password', 'Afirm3#Gat3way')
        params.append('userFasi', 'erojaslara@unitas.mx')
        params.append('passFasi', 'EEROJLA0')
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
            'Authorization': 'Bearer ' + 'UG9ydGFsQWdlbnRlczpvazAw'
        }

        return axios.post('https://www.afirmeseguros.com/gateway/oauth/token', params, {
            headers: headers,
            auth: {
                username: 'PortalAgentes',
                password: 'ok00'
            }
        })
        .then((response) => {
            return response;
        });
    }

    getProductsAfirme(intermedId=93444) {
        const headers = {
            'Authorization': 'Bearer ' + localStorage.getItem('tokenAfirme')
        }

        return axios.get(`https://www.afirmeseguros.com/gateway/catalogs/product/products?intermedId=${intermedId}`, {
            headers: headers
        })
            .then((response) => {
                return response;
            });
    }
    getOficinasAfirme(intermedId=93444) {//94123
        const headers = {
            'Authorization': 'Bearer ' + localStorage.getItem('tokenAfirme')
        }

        return axios.get(`https://www.afirmeseguros.com/gateway/clients/agenciesAllowed?intermedId=${intermedId}`, {
            headers: headers
        })
            .then((response) => {
                return response;
            });
    }

    getBrandsAfirme(typeId) {
        const headers = {
             'Authorization': 'Bearer ' + localStorage.getItem('tokenAfirme')
        }

        return axios.get(`https://www.afirmeseguros.com/gateway/catalogs/vehicles/brands?typeID=${typeId}`, {
            headers: headers
        })
        .then((response) => {
            return response;
        });
    }
    getSubBrandsAfirme(brandID) {
        const headers = {
            'Authorization': 'Bearer ' + localStorage.getItem('tokenAfirme')
        }

        return axios.get(`https://www.afirmeseguros.com/gateway/catalogs/vehicles/subBrands?brandID=${brandID}`, {
            headers: headers
        })
            .then((response) => {
                return response;
            });
    }
    getYearsAfirme(brandID, typeId, subBrandID) {
        const headers = {
            'Authorization': 'Bearer ' + localStorage.getItem('tokenAfirme')
        }

        return axios.get(`https://www.afirmeseguros.com/gateway/catalogs/vehicles/yearsByBrandAndType?brandID=${brandID}&typeId=${typeId}&subBrandID=${subBrandID}`, {
            headers: headers
        })
            .then((response) => {
                return response;
            });
    }
    getModelsAfirme(brandID, typeID, year) {
        const headers = {
            'Authorization': 'Bearer ' + localStorage.getItem('tokenAfirme')
        }

        return axios.get(`https://www.afirmeseguros.com/gateway/catalogs/vehicles/models?brandID=${brandID}&typeID=${typeID}&year=${year}`, {
            headers: headers
        })
        .then((response) => {
            return response;
        });
    }
    getValueTypes(productCode, vehicleTypeId, year) {
        const headers = {
            'Authorization': 'Bearer ' + localStorage.getItem('tokenAfirme')
        }

        return axios.get(`https://www.afirmeseguros.com/gateway/catalogs/vehicles/valueTypes/?productCode=${productCode}&vehicleTypeId=${vehicleTypeId}&year=${year}`, {
            headers: headers
        })
        .then((response) => {
            return response;
        });
    }

    getUseTypes(productCode, vehicleTypeId) {
        const headers = {
            'Authorization': 'Bearer ' + localStorage.getItem('tokenAfirme')
        }

        return axios.get(`https://www.afirmeseguros.com/gateway/catalogs/vehicles/useTypes/?productCode=${productCode}&vehicleTypeId=${vehicleTypeId}`, {
            headers: headers
        })
            .then((response) => {
                return response;
            });
    }

    getEstadoByCP(codPostal) {
        const headers = {
            'Authorization': 'Bearer ' + localStorage.getItem('tokenAfirme')
        }

        return axios.get(`https://www.afirmeseguros.com/gateway/catalogs/locations/address/${codPostal}`, {
            headers: headers
        })
            .then((response) => {
                return response;
            });
    }
    getLocationState(countryId=1) {
        const headers = {
            'Authorization': 'Bearer ' + localStorage.getItem('tokenAfirme')
        }

        return axios.get(`https://www.afirmeseguros.com/gateway/catalogs/locations/states?countryId=${countryId}`, {
            headers: headers
        })
            .then((response) => {
                return response;
            });
    }



    getGenders() {
        const headers = {
            'Authorization': 'Bearer ' + localStorage.getItem('tokenAfirme')
        }

        return axios.get(`https://www.afirmeseguros.com/gateway/catalogs/personals/genders`, {
            headers: headers
        })
        .then((response) => {
            return response;
        });
    }


    getCivilStatus() {
        const headers = {
            'Authorization': 'Bearer ' + localStorage.getItem('tokenAfirme')
        }

        return axios.get(`https://www.afirmeseguros.com/gateway/catalogs/personals/genders`, {
            headers: headers
        })
            .then((response) => {
                return response;
            });
    }

    getPersonsTypes() {
        const headers = {
            'Authorization': 'Bearer ' + localStorage.getItem('tokenAfirme')
        }

        return axios.get(`https://www.afirmeseguros.com/gateway/catalogs/clients/types`, {
            headers: headers
        })
            .then((response) => {
                return response;
            });
    }

    getVehiclesTypeAfirme(productCode) {
        const headers = {
            'Authorization': 'Bearer ' + localStorage.getItem('tokenAfirme')
        }

        return axios.get(`https://www.afirmeseguros.com/gateway/catalogs/vehicles/types?productCode=${productCode}`, {
            headers: headers
        })
            .then((response) => {
                return response;
            });
    }
}
