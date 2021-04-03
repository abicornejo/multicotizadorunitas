import React, { useState, useEffect } from "react";


import { Dropdown } from 'primereact/dropdown';
import { ProductService } from '../services/ProductService';
import { AnaService } from '../services/AnaService';
import {AfirmeService} from '../services/AfirmeService';

import { EventService } from '../services/EventService';
import UserService from "../services/user.service";
import {Steps} from 'primereact/steps';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { addLocale } from 'primereact/api';
import { SelectButton } from 'primereact/selectbutton';
import classNames from 'classnames';
//import Spinner from 'Spinner';
import axios from 'axios';
import Spinner from './Spinner'

const stepsList = [
  {label: 'Datos del Vehiculo'},
  {label: 'Datos Personales'},
  {label: 'Cotización'},
  {label: 'Confirmation'}
];



const Home = () => {
  const [showModal, setShowModal] = useState(false);

  const [content, setContent] = useState("");

  const [tasksCheckbox, setTasksCheckbox] = useState([]);
  const [dropdownCity, setDropdownCity] = useState(null);
  const [events, setEvents] = useState(null);
  const [products, setProducts] = useState(null);
  const [marcas, setMarcas] = useState(null);

  const [personasList, setPersonasList] = useState(null);


  const [valueTypesAfirme, setValueTypesAfirme] = useState(null);
  const [selectedValueTypeAfirme, setSelectedValueTypeAfirme] = useState(null);

  const [useTypesAfirme, setUseTypesAfirme] = useState(null);
  const [selectedUseTypeAfirme, setSelectedUseTypeAfirme] = useState(null);


  const [productsAfirme, setProductsAfirme] = useState(null);
  const [selectedProductAfirme, setSelectedProductAfirme] = useState(null);

  const [oficinasAfirme, setOficinasAfirme] = useState(null);
  const [selectedOficinaAfirme, setSelectedOficinaAfirme] = useState(null);


  const [vehiclesTypeAfirme, setVehiclesTypeAfirme] = useState(null);
  const [selectedVehicleTypeAfirme, setSelectedVehicleTypeAfirme] = useState(null);


  const [marcasAfirme, setMarcasAfirme] = useState(null);
  const [selectedMarcaAfirme, setSelectedMarcaAfirme] = useState(null);

  const [subMarcasAfirme, setSubMarcasAfirme] = useState(null);
  const [selectedSubMarcaAfirme, setSelectedSubMarcaAfirme] = useState(null);

  const [aniosAfirme, setAniosAfirme] = useState(null);
  const [selectedAnioAfirme, setSelectedAnioAfirme] = useState(null);

  const [modelosAfirme, setModelosAfirme] = useState(null);
  const [selectedModeloAfirme, setSelectedModeloAfirme] = useState(null);

  const [subMarcas, setSubMarcas] = useState(null);
  const [modelos, setModelos] = useState(null);
  const [versiones, setVersiones] = useState(null);

  const [selectedMarca, setSelectedMarca] = useState(null);
  const [selectedSubMarca, setSelectedSubMarca] = useState(null);
  const [selectedModelo, setSelectedModelo] = useState(null);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [ spinner, setSpinner ] = useState(true);
  const [ stepActive, setStepActive ] = useState(0);

  const [generoSelected, setGeneroSelected] = useState(null);
  const [personaSelected, setPersonaSelected] = useState(null);


  const [cliente, setCliente] = useState({
    tipo : '',
    genero : '',
    razonSocial:'',
    nombre : '',
    apePaterno : '',
    apeMaterno : '',
    correo : '',
    telefono : '',
    celular : '',
    fecNacimiento : '',
    codPostal :'' ,
    estado : '',
    municipio : ''
  });
  const [submitted, setSubmitted]= useState(false);

  addLocale('es', {
    firstDayOfWeek: 1,
    dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
    dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
    dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
    monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
    monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
    today: 'Hoy',
    clear: 'Claro'
  });

  useEffect(async() => {
    debugger;
    if(cliente.codPostal.length === 5){
      getEstadosByCodPostalAfirme(cliente.codPostal);
    }

    },[cliente.codPostal]);
  useEffect(async() => {
    setShowModal(true);
    const obj = new AfirmeService();
    const resp = await obj.getTokenAfirme();

    if (resp && resp.data){
      localStorage.setItem('tokenAfirme', resp.data.access_token)

      const prod = await obj.getProductsAfirme();

      if(prod && prod.data){
        const prodDefault = prod.data.data.find(item => item.spreffix === 'TR');
        clickProductoAfirme(prodDefault);
        //setProductsAfirme(prod.data.data);
        console.log("AFIRME Products");
        console.log(prod.data);
      }
      setShowModal(false);

      const persons = await obj.getPersonsTypes();

      if(persons && persons.data){debugger;
        setPersonasList(persons.data.data);
        let tem = {...cliente};
        tem['tipo'] = persons.data.data[0];
        setCliente(tem);
        console.log("AFIRME Persons");
        console.log(persons.data);
      }
      //setShowModal(false);


    }



    // UserService.getPublicContent().then(
    //   (response) => {
    //     setContent(response.data);
    //   },
    //   (error) => {
    //     const _content =
    //       (error.response && error.response.data) ||
    //       error.message ||
    //       error.toString();
    //
    //     setContent(_content);
    //   }
    // );
  }, []);

  useEffect(() => {
    const productService = new ProductService();
    const eventService = new EventService();
    const anaService = new AnaService();
    //showLoader();
    //setShowModal(true);
    anaService.wsListarMarcas().then(resp => {
      const r = resp.marcas.original;
      let parser, xmlDoc;
      parser = new DOMParser();
      xmlDoc = parser.parseFromString(r,"text/xml");

      const lstMarcas = xmlDoc.documentElement.getElementsByTagName("marcas");

      if (lstMarcas && lstMarcas.length){
        const arr = [...lstMarcas];

        let temp = arr.filter(item => {
          return item;
        }).map(item =>{
          const id = item.childNodes[0].innerHTML;
          const nombre = item.childNodes[1].innerHTML;

          return {label: nombre, value: id};
        });
        //hideLoader();
        setMarcas(temp);
      }
      //setShowModal(false);
      //hideLoader();
    });
   // productService.getProductsSmall().then(data => setProducts(data));
   // eventService.getEvents().then(data => setEvents(data));
    //soapCall();
  }, []);

  const clickMarcaAfirme =(marca)=>{

    setSelectedMarcaAfirme(marca);
    getSubMarcasAfirme(marca);
  }
  const clickProductoAfirme =(codeProduct)=>{

    setSelectedProductAfirme(codeProduct);
    setSelectedMarcaAfirme(null);
    setMarcasAfirme([]);
    getVehiclesTypeAfirme(codeProduct.id);
    getOficinasAfirme(codeProduct.id)
  }
  const clickOficinaAfirme =(oficina)=>{

    setSelectedOficinaAfirme(oficina);
    //getVehiclesTypeAfirme(codeProduct);
  }
  const clickVehiculoTypeAfirme =(vehiculoType)=>{

    setSelectedVehicleTypeAfirme(vehiculoType);
    getMarcasAfirme(vehiculoType.id);
    //getUseTypesAfirme(selectedProductAfirme.id,vehiculoType.id)
  }
  const clickSubMarcaAfirme =(subMarca)=>{

    setSelectedSubMarcaAfirme(subMarca);
    getAniosAfirme(selectedMarcaAfirme.id, selectedVehicleTypeAfirme.id, subMarca.id);
  }
  const clickAnioAfirme =(anio)=>{

    setSelectedAnioAfirme(anio);
    getModelosAfirme(selectedMarcaAfirme.id,selectedVehicleTypeAfirme.id, anio.id);
    getValueTypesAfirme(selectedProductAfirme.id,selectedVehicleTypeAfirme.id, anio.id);
    getUseTypesAfirme(selectedProductAfirme.id,selectedVehicleTypeAfirme.id);

  }
  const clickModeloAfirme =(modelo)=>{

    setSelectedModeloAfirme(modelo);
    //getModelosAfirme(selectedMarcaAfirme.id,selectedVehicleTypeAfirme.id, anio.id);
    //getValueTypesAfirme(selectedProductAfirme.id,selectedVehicleTypeAfirme.id, anio.id);

  }
  const clickValueTypeAfirme =(valueType)=>{

    setSelectedValueTypeAfirme(valueType);
    //getUseTypesAfirme();
    //getValueTypesAfirme()


    //getModelosAfirme(selectedMarcaAfirme.id,selectedVehicleTypeAfirme.id, anio.id);
    //getValueTypesAfirme(selectedProductAfirme.id,selectedVehicleTypeAfirme.id, anio.id);

  }
  const clickUseTypeAfirme =(useType)=>{

    setSelectedUseTypeAfirme(useType);
    //getModelosAfirme(selectedMarcaAfirme.id,selectedVehicleTypeAfirme.id, anio.id);
    //getValueTypesAfirme(selectedProductAfirme.id,selectedVehicleTypeAfirme.id, anio.id);

  }

  const clickMarca =(marca)=>{
    setSelectedMarca(marca);
    getSubmarcas(marca);
  }
  const clickSubMarca =(subMarca)=>{
    setSelectedSubMarca(subMarca);
    getModelos(subMarca);
  }
  const clickModelo =(modelo, subMarca)=>{
    setSelectedModelo(modelo);
    getVersiones(subMarca, modelo);
  }
  const clickVersion =(version)=>{
    setSelectedVersion(version);
    //getVersiones(subMarca, modelo);
  }

  const getSubmarcas = (idMarca) => {
    const anaService = new AnaService();
    setShowModal(true);
    anaService.wsListarSubMarcas(idMarca).then(resp => {
      const r = resp.subMarcas.original;
      let parser, xmlDoc;
      parser = new DOMParser();
      xmlDoc = parser.parseFromString(r,"text/xml");

      const lstMarcas = xmlDoc.documentElement.getElementsByTagName("submarcas");
      if (lstMarcas && lstMarcas.length){
        const arr = [...lstMarcas];

        let temp = arr.filter(item => {
          return item;
        }).map(item =>{
          const id = item.childNodes[0].innerHTML;
          const nombre = item.childNodes[2].innerHTML;

          return {label: nombre, value: id};
        });
        setSubMarcas(temp);
      }
      setShowModal(false);
    });
  }
  const getModelos = (idSubMarca) => {
    const anaService = new AnaService();
    setShowModal(true);
    anaService.wsListarModelos(idSubMarca).then(resp => {
      const r = resp.modelos.original;
      let parser, xmlDoc;
      parser = new DOMParser();
      xmlDoc = parser.parseFromString(r,"text/xml");

      const lstMarcas = xmlDoc.documentElement.getElementsByTagName("modelos");

      if (lstMarcas && lstMarcas.length){
        const arr = [...lstMarcas];

        let temp = arr.filter(item => {
          return item;
        }).map(item =>{
          const id = item.childNodes[0].data;
          const nombre = item.childNodes[0].data;

          return {label: nombre, value: id};
        });
        setModelos(temp);
      }
      setShowModal(false);

    });

  }

  const getMarcasAfirme = async(idType) => {
    setShowModal(true);
    const obj = new AfirmeService();
    const brandsAfirme = await obj.getBrandsAfirme(idType);

    if(brandsAfirme && brandsAfirme.data){
      setMarcasAfirme(brandsAfirme.data.data);
      console.log("AFIRME");
      console.log(brandsAfirme.data);
    }
    setShowModal(false);
  }
  const getSubMarcasAfirme = async(idBrand) => {
    setShowModal(true);
    const obj = new AfirmeService();
    const resp = await obj.getSubBrandsAfirme(idBrand.id);

    if (resp && resp.data){
      setSubMarcasAfirme(resp.data.data);
      console.log("AFIRME Submarcas");
      console.log(resp.data.data);
    }
    setShowModal(false);
  }
  const getVehiclesTypeAfirme = async(productId) => {
    setShowModal(true);
    const obj = new AfirmeService();
    const resp = await obj.getVehiclesTypeAfirme(productId);

    if (resp && resp.data){
      const temp = resp.data.data.map(item=>{
        return {id: item.Code ,description:item.Description}
      });
      setVehiclesTypeAfirme(temp);
      console.log("AFIRME vehicles type");
      console.log(temp);
    }
    setShowModal(false);
  }
  const getOficinasAfirme = async(product) => {
    setShowModal(true);
    const obj = new AfirmeService();
    const resp = await obj.getOficinasAfirme(product.id);

    if (resp && resp.data){
      // const temp = resp.data.data.map(item=>{
      //   return {id: item.Code ,description:item.Description}
      // });
      setOficinasAfirme(resp.data.data);
      console.log("AFIRME Oficinas");
      console.log(resp.data.data);
    }
    setShowModal(false);

  }
  const getAniosAfirme = async(idBrand, typeId, idSubBrand) => {
    setShowModal(true);

    const obj = new AfirmeService();
    const resp = await obj.getYearsAfirme(idBrand, typeId ,idSubBrand);

    if (resp && resp.data){

      const temp = resp.data.data.map(item=>{
        return {id: item.id ,description:item.id}
      });
      setAniosAfirme(temp);
      console.log("AFIRME anios");
      console.log(temp);
    }
    setShowModal(false);

  }
  const getModelosAfirme = async(idBrand, typeID, year) => {
    setShowModal(true);

    const obj = new AfirmeService();
    const resp = await obj.getModelsAfirme(idBrand, typeID, year);

    if (resp && resp.data){
        setModelosAfirme(resp.data.data);
        console.log("AFIRME Models");
        console.log(resp.data.data);
    }
    setShowModal(false);

  }

  const getValueTypesAfirme = async(productCode, vehicleTypeID, year) => {
    setShowModal(true);

    const obj = new AfirmeService();
    const resp = await obj.getValueTypes(productCode, vehicleTypeID, year);

    if (resp && resp.data){
      setValueTypesAfirme(resp.data.data);
      setSelectedValueTypeAfirme(resp.data.data[0]);
      console.log("AFIRME Value types");
      console.log(resp.data.data);
    }

    setShowModal(false);

  }
  const getUseTypesAfirme = async(productCode, vehicleTypeID) => {
    setShowModal(true);

    const obj = new AfirmeService();
    const resp = await obj.getUseTypes(productCode, vehicleTypeID);

    if (resp && resp.data){
      setUseTypesAfirme(resp.data.data);
      setSelectedValueTypeAfirme(resp.data.data[0]);
      console.log("AFIRME use types");
      console.log(resp.data.data);
    }
    setShowModal(false);

  }

  const getEstadosByCodPostalAfirme = async(codigoPostal) => {
    setShowModal(true);

    const obj = new AfirmeService();
    const resp = await obj.getEstadoByCP(codigoPostal);

    if (resp && resp.data && resp.data.data){
      //set(resp.data.data);
      console.log("AFIRME use types");
      console.log(resp.data.data);

      let tem = {...cliente};

      tem.estado = resp.data.data.nombreEstado;
      tem.idEstado = resp.data.data.idEstado;
      tem.municipio = resp.data.data.nombreCiudad;

      setCliente(tem);
    }
    setShowModal(false);


  }


  const getVersiones = (idSubMarca, idModelo) => {
    const anaService = new AnaService();
    setShowModal(true);

    anaService.wsListarVersiones(idSubMarca, idModelo).then(resp => {
      const r = resp.versiones.original;
      let parser, xmlDoc;
      parser = new DOMParser();
      xmlDoc = parser.parseFromString(r,"text/xml");

      const lstMarcas = xmlDoc.documentElement.getElementsByTagName("versiones");

      if (lstMarcas && lstMarcas.length){
        const arr = [...lstMarcas];

        let temp = arr.filter(item => {
          return item;
        }).map(item =>{
          const id = item.childNodes[0].innerHTML;
          const nombre = item.childNodes[1].innerHTML;

          return {label: nombre, value: id};
        });
        setVersiones(temp);
      }
      setShowModal(false);


    });

  }

  const emailValido = (mail) => {
    let emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i

    return emailRegex.test(mail);
  }

  const validaDatosVehiculo = () => {
    if(selectedVehicleTypeAfirme && selectedMarcaAfirme && selectedSubMarcaAfirme && selectedAnioAfirme && selectedModeloAfirme){
      return true;
    }
    return false;
  }

  const validaDatosCliente = () => {
    debugger;
    if(cliente.correo && emailValido(cliente.correo) && cliente.celular.length > 0 && cliente.celular.length === 10
        && cliente.fecNacimiento && cliente.codPostal && cliente.codPostal.length === 5 && cliente.estado
        && cliente.municipio
    ){
      if(cliente.telefono.length > 0 && cliente.telefono.length  !== 10){
        return false;
      }
      return true;
    }
    return false;
  }

  const incrementSteps = (e) => {
    debugger;
    e.preventDefault();
    setSubmitted(true);

    if(stepActive === 0){

      if(validaDatosVehiculo()){
        setStepActive(stepActive + 1);
      }

    }else if(stepActive === 1){

      if(validaDatosCliente()){
        setStepActive(stepActive + 1);
      }
    }

  }
  const generoTemplate = (option) => {
    return <React.Fragment>
            <img style={{verticalAlign: 'middle', marginRight: '.5em'}}
                 src={"assets/img/" + option.avatar} height="20px"/>
      <span>{option.name}</span>
    </React.Fragment>
  }
  const personaTemplate = (option) => {
    return <React.Fragment>
      <span>{option.description}</span>
    </React.Fragment>
  }

  const generoList = [
    {name: 'Masculino', avatar: 'boy.png'},
    {name: 'Femenino', avatar: 'girl.png'}
  ];



  const validaCodPostal=(e)=>{
    if(e.currentTarget.value.length===5)return false;
  }

  const validaTelefono=(e)=>{
    if(e.currentTarget.value.length===10)return false;
  }

  const onInputCliente =(evt) => {debugger;
    let value = evt.target.value;

    let tem = {...cliente};
    tem[evt.target.name] = value;
    setCliente(tem);
  }


  const onInputTelefono =(evt)=>{
    const inputTelefono = (evt.target.validity.valid) ?
        evt.target.value : cliente.telefono;

    let tem = {...cliente};
    if(inputTelefono.length <= 10) {
      tem.telefono = inputTelefono;
      setCliente(tem);
    }
  }
  const onInputCodPostal =(evt)=>{
    const codPostal = evt.target.value;

    let tem = {...cliente};

    if(codPostal.length <= 5) {
      tem.codPostal = codPostal;
      setCliente(tem);
    }
  }

  const onBlurCodPostal = (evt) => {
    debugger;
    //if (evt.keyCode === 40) {
      //e.target.blur();
      // or set the state as you wish
      const codPostal = evt.target.value;

      if(codPostal.length === 5){
        getEstadosByCodPostalAfirme(codPostal);
      }
    //}

  }
  const onInputCelular = (evt) => {
    const financialGoal = (evt.target.validity.valid) ?
        evt.target.value : cliente.celular;

    let tem = {...cliente};
    if(financialGoal.length <= 10) {
      tem.celular = financialGoal;
      setCliente(tem);
    }
  }
  return (
      <div className="container-fluid min-100 d-flex flex-column justify-content-center">
        <div className="row flex-grow">
          <div className="col fondoAzul headtop d-flex justify-content-between">
            <img src="assets/img/titulo.svg" className="card-img-top p-2 w-25" alt="Titulo"/>
            <img src="assets/img/logob.svg" className="card-img-top p-2 w-25" alt="Logo"/>
            {showModal  ?
                <Spinner/>
              : null
            }
          </div>
        </div>
        <Steps model={stepsList} activeIndex={stepActive} />
        { stepActive === 0 ?
            <React.Fragment>
              <div className="row flex-grow align-self-center w-75">
                <div className="card shadow">
                  <div className="card-body">
                    <h5 className="card-title colorAzul">
                      <i className="fas fa-car"/> Datos del Vehículo
                    </h5>
                    <hr/>
                    <div className="card-tex">
                      <form>
                        <div className="row">

                          {/*<div className="col-12">*/}
                            {/*<label htmlFor="exampleFormControlInput1" className="form-label">Productos Afirme</label>*/}
                            {/*<Dropdown*/}
                                {/*value={selectedProductAfirme}*/}
                                {/*options={productsAfirme}*/}
                                {/*onChange={(e) => {clickProductoAfirme(e.value)}}*/}
                                {/*placeholder="Selecciona Producto"*/}
                                {/*optionLabel="description"*/}
                                {/*filter showClear filterBy="description"*/}
                            {/*/>*/}
                          {/*</div>*/}
                          {/*<div className="col-12">*/}
                            {/*<label htmlFor="exampleFormControlInput1" className="form-label">Oficinas Afirme</label>*/}
                            {/*<Dropdown*/}
                                {/*value={selectedOficinaAfirme}*/}
                                {/*options={oficinasAfirme}*/}
                                {/*onChange={(e) => {clickOficinaAfirme(e.value)}}*/}
                                {/*placeholder="Selecciona Oficina"*/}
                                {/*optionLabel="description"*/}
                                {/*filter showClear filterBy="description"*/}
                            {/*/>*/}
                          {/*</div>*/}


                          <div className="col-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label">Tipo de vehiculo</label>
                            <Dropdown
                                value={selectedVehicleTypeAfirme}
                                options={vehiclesTypeAfirme}
                                onChange={(e) => {clickVehiculoTypeAfirme(e.value)}}
                                placeholder="Selecciona tipo de vehiculo"
                                optionLabel="description"
                                filter showClear filterBy="description"
                                className={classNames({ 'p-invalid': submitted && !selectedVehicleTypeAfirme})}

                            />
                            {submitted && !selectedVehicleTypeAfirme && <small className="p-error">Campo es requerido.</small>}
                          </div>

                          <div className="col-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label">Marca</label>
                            <Dropdown
                                value={selectedMarcaAfirme}
                                options={marcasAfirme}
                                onChange={(e) => {clickMarcaAfirme(e.value)}}
                                placeholder="Selecciona Marca"
                                optionLabel="description"
                                filter showClear filterBy="description"
                                className={classNames({ 'p-invalid': submitted && !selectedMarcaAfirme})}

                            />
                            {submitted && !selectedMarcaAfirme && <small className="p-error">Campo es requerido.</small>}
                          </div>

                          <div className="col-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label">SubMarca</label>
                            <Dropdown
                                value={selectedSubMarcaAfirme}
                                options={subMarcasAfirme}
                                onChange={(e) => {clickSubMarcaAfirme(e.value)}}
                                placeholder="Selecciona SubMarca"
                                optionLabel="description"
                                filter showClear filterBy="description"
                                className={classNames({ 'p-invalid': submitted && !selectedSubMarcaAfirme})}

                            />
                            {submitted && !selectedSubMarcaAfirme && <small className="p-error">Campo es requerido.</small>}
                          </div>
                          <div className="col-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label">Año Afirme</label>
                            <Dropdown
                                value={selectedAnioAfirme}
                                options={aniosAfirme}
                                onChange={(e) => {clickAnioAfirme(e.value)}}
                                placeholder="Selecciona Año"
                                optionLabel="description"
                                filter showClear filterBy="description"
                                className={classNames({ 'p-invalid': submitted && !selectedAnioAfirme})}

                            />
                            {submitted && !selectedAnioAfirme && <small className="p-error">Campo es requerido.</small>}

                          </div>
                          <div className="col-4">
                            <label htmlFor="exampleFormControlInput1" className="form-label">Modelos</label>
                            <Dropdown
                                value={selectedModeloAfirme}
                                options={modelosAfirme}
                                optionLabel="description"
                                onChange={(e) => {clickModeloAfirme(e.value)}}
                                placeholder="Selecciona Modelo Afirme"
                                filter showClear filterBy="description"
                                className={classNames({ 'p-invalid': submitted && !selectedModeloAfirme})}
                            />
                            {submitted && !selectedModeloAfirme && <small className="p-error">Campo es requerido.</small>}
                          </div>

                          {/*<div className="col-12">*/}
                            {/*<label htmlFor="exampleFormControlInput1" className="form-label">Uso Vehiculo Afirme</label>*/}
                            {/*<Dropdown*/}
                                {/*value={selectedUseTypeAfirme}*/}
                                {/*options={useTypesAfirme}*/}
                                {/*optionLabel="description"*/}
                                {/*onChange={(e) => {clickUseTypeAfirme(e.value)}}*/}
                                {/*placeholder="Selecciona Uso Vehiculo Afirme"*/}
                                {/*filter showClear filterBy="description"*/}
                            {/*/>*/}
                          {/*</div>*/}

                          {/*<div className="col-12">*/}
                            {/*<label htmlFor="exampleFormControlInput1" className="form-label">Tipo de Valor Afirme</label>*/}
                            {/*<Dropdown*/}
                                {/*value={selectedValueTypeAfirme}*/}
                                {/*options={valueTypesAfirme}*/}
                                {/*optionLabel="description"*/}
                                {/*onChange={(e) => {clickValueTypeAfirme(e.value)}}*/}
                                {/*placeholder="Selecciona Tipo Valor"*/}
                                {/*filter showClear filterBy="description"*/}
                            {/*/>*/}
                          {/*</div>*/}

                          {/*<div className="col">*/}
                            {/*<label htmlFor="exampleFormControlInput1" className="form-label">Marca</label>*/}
                            {/*<Dropdown*/}
                                {/*value={selectedMarca}*/}
                                {/*options={marcas}*/}
                                {/*onChange={(e) => {clickMarca(e.value)}}*/}
                                {/*placeholder="Selecciona Marca"*/}
                                {/*filter showClear filterBy="label"*/}
                            {/*/>*/}
                          {/*</div>*/}
                          {/*<div className="col">*/}
                            {/*<label htmlFor="exampleFormControlInput1" className="form-label">Submarca</label>*/}
                            {/*<Dropdown*/}
                                {/*value={selectedSubMarca}*/}
                                {/*options={subMarcas}*/}
                                {/*onChange={(e) => {clickSubMarca(e.value)}}*/}
                                {/*placeholder="Selecciona SubMarca"*/}
                                {/*filter showClear filterBy="label"*/}
                            {/*/>*/}
                          {/*</div>*/}
                          {/*<div className="col">*/}
                            {/*<label htmlFor="exampleFormControlInput1" className="form-label">Modelo</label>*/}
                            {/*<Dropdown*/}
                                {/*value={selectedModelo}*/}
                                {/*options={modelos}*/}
                                {/*onChange={(e) => {clickModelo(e.value, selectedSubMarca)}}*/}
                                {/*placeholder="Selecciona Modelo"*/}
                                {/*filter showClear filterBy="label"*/}
                            {/*/>*/}
                          {/*</div>*/}
                        </div>



                        {/*<div className="row">*/}
                          {/*<div className="col">*/}
                            {/*<label htmlFor="exampleFormControlInput1" className="form-label">Version/Transmisión</label>*/}
                            {/*<Dropdown*/}
                                {/*value={selectedVersion}*/}
                                {/*options={versiones}*/}
                                {/*onChange={(e) => {clickVersion(e.value)}}*/}
                                {/*placeholder="Selecciona Version"*/}
                                {/*filter showClear filterBy="label"*/}
                            {/*/>*/}
                          {/*</div>*/}

                        {/*</div>*/}
                        <div className="row">
                          <div className="col">
                            <Button style={{float:'right'}} onClick={(e)=>incrementSteps(e)} label="Continuar" className="p-button-rounded" />
                          </div>
                        </div>
                        {/*<div className="row">*/}

                          {/*<div className="col">*/}
                            {/*<label htmlFor="exampleFormControlInput1" className="form-label">Tipo de Auto</label>*/}
                            {/*<select defaultValue={'DEFAULT'} className="form-select form-select-lg rounded-pill mb-3 fondoceleste"*/}
                                    {/*aria-label=".form-select-lg example">*/}
                              {/*<option selected>Open this select menu</option>*/}
                              {/*<option value="1">One</option>*/}
                            {/*</select>*/}
                          {/*</div>*/}
                          {/*<div className="col">*/}
                            {/*<label htmlFor="exampleFormControlInput1" className="form-label">Año</label>*/}
                            {/*<select defaultValue={'DEFAULT'} className="form-select form-select-lg rounded-pill mb-3 fondoceleste"*/}
                                    {/*aria-label=".form-select-lg example">*/}
                              {/*<option selected>Open this select menu</option>*/}
                              {/*<option value="1">One</option>*/}
                            {/*</select>*/}
                          {/*</div>*/}
                        {/*</div>*/}
                        {/*<div className="row">*/}
                          {/*<div className="col">*/}
                            {/*<label htmlFor="exampleFormControlInput1" className="form-label">Uso</label>*/}
                            {/*<select defaultValue={'DEFAULT'} className="form-select form-select-lg rounded-pill mb-3 fondoceleste"*/}
                                    {/*aria-label=".form-select-lg example">*/}
                              {/*<option selected>Open this select menu</option>*/}
                              {/*<option value="1">One</option>*/}
                            {/*</select>*/}
                          {/*</div>*/}
                          {/*<div className="col">*/}
                            {/*<label htmlFor="exampleFormControlInput1" className="form-label">Riesgo de la Carga</label>*/}
                            {/*<select defaultValue={'DEFAULT'} className="form-select form-select-lg rounded-pill mb-3 fondoceleste"*/}
                                    {/*aria-label=".form-select-lg example">*/}
                              {/*<option selected>Open this select menu</option>*/}
                              {/*<option value="1">One</option>*/}
                            {/*</select>*/}
                          {/*</div>*/}
                          {/*<div className="col">*/}
                            {/*<label htmlFor="exampleFormControlInput1" className="form-label">Descripción del Riesgo</label>*/}
                            {/*<select defaultValue={'DEFAULT'} className="form-select form-select-lg rounded-pill mb-3 fondoceleste"*/}
                                    {/*aria-label=".form-select-lg example">*/}
                              {/*<option selected>Open this select menu</option>*/}
                              {/*<option value="1">One</option>*/}
                            {/*</select>*/}
                          {/*</div>*/}
                        {/*</div>*/}
                        {/*<div className="row">*/}
                          {/*<div className="col">*/}
                            {/*<label htmlFor="exampleFormControlInput1" className="form-label">Servicio</label>*/}
                            {/*<select defaultValue={'DEFAULT'} className="form-select form-select-lg rounded-pill mb-3 fondoceleste"*/}
                                    {/*aria-label=".form-select-lg example">*/}
                              {/*<option selected>Open this select menu</option>*/}
                              {/*<option value="1">One</option>*/}
                            {/*</select>*/}
                          {/*</div>*/}
                          {/*<div className="col">*/}
                            {/*<label htmlFor="exampleFormControlInput1" className="form-label">Remolque</label>*/}
                            {/*<select defaultValue={'DEFAULT'} className="form-select form-select-lg rounded-pill mb-3 fondoceleste"*/}
                                    {/*aria-label=".form-select-lg example">*/}
                              {/*<option selected>Open this select menu</option>*/}
                              {/*<option value="1">One</option>*/}
                            {/*</select>*/}
                          {/*</div>*/}
                          {/*<div className="col">*/}
                            {/*<label htmlFor="exampleFormControlInput1" className="form-label">Puertas</label>*/}
                            {/*<select defaultValue={'DEFAULT'} className="form-select form-select-lg rounded-pill mb-3 fondoceleste"*/}
                                    {/*aria-label=".form-select-lg example">*/}
                              {/*<option selected>Open this select menu</option>*/}
                              {/*<option value="1">One</option>*/}
                            {/*</select>*/}
                          {/*</div>*/}
                          {/*<div className="col">*/}
                            {/*<label htmlFor="exampleFormControlInput1" className="form-label">Código Postal</label>*/}
                            {/*<select defaultValue={'DEFAULT'} className="form-select form-select-lg rounded-pill mb-3 fondoceleste"*/}
                                    {/*aria-label=".form-select-lg example">*/}
                              {/*<option selected>Open this select menu</option>*/}
                              {/*<option value="1">One</option>*/}
                            {/*</select>*/}
                          {/*</div>*/}
                        {/*</div>*/}
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row text-right">

              </div>

            </React.Fragment> : null
        }
        {
          stepActive === 1 ?
              <React.Fragment>
                <div className="row flex-grow align-self-center w-75">
                  <div className="card shadow">
                    <div className="card-body">
                      <h5 className="card-title colorAzul">
                        <i className="fas fa-car"/> Datos Personales
                      </h5>
                      <hr/>
                      <div className="card-tex">
                        <form className="row g-3 needs-validation">

                          {/*<div className="col-md-12">*/}
                            {/*<label htmlFor="username" className="form-label">Tipo de Persona</label>*/}
                            {/*<SelectButton value={personaSelected} name="tipo"  onChange={(e) => onInputCliente(e)} options={personasList} itemTemplate={personaTemplate} />*/}
                          {/*</div>*/}



                            <div className="col-md-3">
                              <label htmlFor="correo" className="form-label">Correo</label>
                              <InputText id="correo" name="correo" onInput={(e)=>onInputCliente(e)}  value={cliente.correo} className={classNames({ 'p-invalid': (submitted && !cliente.correo || submitted && cliente.correo.length > 0 && !emailValido(cliente.correo)) })}/>
                              {submitted && !cliente.correo && <small className="p-error">Correo es requerido.</small>}
                              {submitted && cliente.correo.length > 0 && !emailValido(cliente.correo)  && <small className="p-error">Correo es invalido.</small>}
                            </div>
                            <div className="col-md-3">
                              <label htmlFor="telefono" className="form-label">Telefono</label>
                              <InputText id="telefono" name="telefono" onInput={(e)=>onInputTelefono(e)} value={cliente.telefono} pattern="[0-9]*" className="form-control" className={classNames({ 'p-invalid': submitted && cliente.telefono.length >0 && cliente.telefono.length < 10 })} />
                               {submitted  && cliente.telefono.length > 0 && cliente.telefono.length < 10 && <small className="p-error">Telefono debe contener 10 digitos.</small>}

                            </div>
                          <div className="col-md-3">
                            <label htmlFor="celular" className="form-label">Celular</label>
                            <InputText id="celular" name="celular" onInput={(e)=>onInputCelular(e)} value={cliente.celular} pattern="[0-9]*" className="form-control" className={classNames({ 'p-invalid': (submitted && !cliente.celular || submitted && cliente.celular.length >0 && cliente.celular.length < 10) })}/>
                            {submitted && !cliente.celular && <small className="p-error">Celular es requerido.</small>}

                            {submitted && cliente.celular.length >0 && cliente.celular.length < 10 && <small className="p-error">Celular debe contener 10 digitos.</small>}

                          </div>
                            <div className="col-md-3">
                              <label htmlFor="fecNacimiento" className="form-label">Fecha de Nacimiento</label>
                              <Calendar showIcon={true} onChange={(e)=>onInputCliente(e)} name="fecNacimiento" id="fecNacimiento" locale="es" dateFormat="dd/mm/yy" value={cliente.fecNacimiento} inputClassName={classNames({ 'p-invalid': submitted && !cliente.fecNacimiento})} />
                              {submitted && !cliente.fecNacimiento && <small className="p-error">Fecha de nacimiento es requerida.</small>}

                            </div>
                            <div className="col-md-3">
                              <label htmlFor="codPostal" className="form-label">Codigo Postal</label>
                              <InputText name="codPostal" onInput={(e)=>onInputCodPostal(e)} id="codPostal"  aria-describedby="cp-help" keyfilter="int"  required className={classNames({ 'p-invalid': (submitted && !cliente.codPostal || submitted && cliente.codPostal && cliente.codPostal.length < 5)  })}/>
                              {submitted && !cliente.codPostal && <small className="p-error">Codigo Postal es requerido.</small>}
                              {submitted && cliente.codPostal &&  cliente.codPostal.length < 5 && <small className="p-error">Codigo Postal debe contener 5 digitos.</small>}

                            </div>
                          <div className="col-md-3">
                            <label htmlFor="txtEstado" className="form-label">Estado</label>
                            <InputText disabled id="txtEstado" value={cliente.estado}  aria-describedby="cp-help" required className={classNames({ 'p-invalid': submitted && !cliente.estado })}/>
                            {submitted && !cliente.estado && <small className="p-error">Estado es requerido.</small>}

                          </div>
                          <div className="col-md-3">
                          <label htmlFor="txtMunicipio" className="form-label">Municipio</label>
                          <InputText disabled id="txtMunicipio" value={cliente.municipio}  aria-describedby="cp-help" keyfilter="int"  required className={classNames({ 'p-invalid': submitted && !cliente.municipio })}/>
                           {submitted && !cliente.municipio && <small className="p-error">Municipio es requerido.</small>}

                          </div>

                            <div className="col-md-12">
                              <Button style={{float:'right'}} onClick={(e)=>incrementSteps(e)} label="Continuar" className="p-button-rounded" />
                            </div>

                        </form>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row text-right">

                </div>

              </React.Fragment>
              : null
        }

        { stepActive === 2 ?
          <React.Fragment>
            <div className="row flex-grow align-self-center w-75 my-5">
              <div className="card shadow">
                <div className="card-body">
                  <h5 className="card-title colorAzul">
                    <i className="fas fa-receipt"/> Cotización</h5>
                  <hr/>
                  <table className="table table-borderless">
                    <tr className="text-center">
                      <td className="text-center w-15"/>
                      <td className="w-20">Amplia</td>
                      <td className="w-20">Limitada</td>
                      <td className="w-20">RC</td>
                      <td className="text-center w-5"/>
                    </tr>
                  </table>
                  <table className="table table-borderless text-center">
                    <tr>
                      <td className="text-center w-15">
                        <img src="assets/img/LogoZurich.svg" className="card-img"
                                                            alt="Titulo"/>
                      </td>
                      <td>
                        <table className="w-100 table-borderless fondoceleste rounded-pill">
                          <tr>
                            <td className="p-2">dato</td>
                            <td className="p-2 border-y">dato</td>
                            <td className="p-2">dato</td>
                          </tr>
                        </table>
                      </td>
                      <td className="text-center w-5">
                        <i className="fas fa-file-download fa-3x"/>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-center w-15">
                        <img src="assets/img/LogoAfirme.svg" className="card-img"
                                                            alt="Titulo"/>
                      </td>
                      <td>
                        <table className="w-100 table-borderless fondoceleste rounded-pill">
                          <tr>
                            <td className="p-2">dato</td>
                            <td className="p-2 border-y">dato</td>
                            <td className="p-2">dato</td>
                          </tr>
                        </table>
                      </td>
                      <td className="text-center w-5">
                        <i className="fas fa-file-download fa-3x"/>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-center w-15">
                        <img src="assets/img/LogoQualitas.svg" className="card-img"
                                                            alt="Titulo"/>
                      </td>
                      <td>
                        <table className="w-100 table-borderless fondoceleste rounded-pill">
                          <tr>
                            <td className="p-2">dato</td>
                            <td className="p-2 border-y">dato</td>
                            <td className="p-2">dato</td>
                          </tr>
                        </table>
                      </td>
                      <td className="text-center w-5">
                        <i className="fas fa-file-download fa-3x"/>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-center w-15">
                        <img src="assets/img/LogoInbursa.svg" className="card-img"
                                                            alt="Titulo"/>
                      </td>
                      <td>
                        <table className="w-100 table-borderless fondoceleste rounded-pill">
                          <tr>
                            <td className="p-2">dato</td>
                            <td className="p-2 border-y">dato</td>
                            <td className="p-2">dato</td>
                          </tr>
                        </table>
                      </td>
                      <td className="text-center w-5">
                        <i className="fas fa-file-download fa-3x"/>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-center w-15">
                        <img src="assets/img/LogoAxa.svg" className="card-img"
                                                            alt="Titulo"/>
                      </td>
                      <td>
                        <table className="w-100 table-borderless fondoceleste rounded-pill">
                          <tr>
                            <td className="p-2">dato</td>
                            <td className="p-2 border-y">dato</td>
                            <td className="p-2">dato</td>
                          </tr>
                        </table>
                      </td>
                      <td className="text-center w-5">
                        <i className="fas fa-file-download fa-3x"/>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-center w-15">
                        <img src="assets/img/LogoLatino.svg" className="card-img"
                                                            alt="Titulo"/>
                        </td>
                      <td>
                        <table className="w-100 table-borderless fondoceleste rounded-pill">
                          <tr>
                            <td className="p-2">dato</td>
                            <td className="p-2 border-y">dato</td>
                            <td className="p-2">dato</td>
                          </tr>
                        </table>
                      </td>
                      <td className="text-center w-5">
                        <i className="fas fa-file-download fa-3x"/></td>
                    </tr>
                    <tr>
                      <td className="text-center w-15">
                        <img src="assets/img/LogoMapfre.svg" className="card-img"
                                                            alt="Titulo"/>
                      </td>
                      <td>
                        <table className="w-100 table-borderless fondoceleste rounded-pill">
                          <tr>
                            <td className="p-2">dato</td>
                            <td className="p-2 border-y">dato</td>
                            <td className="p-2">dato</td>
                          </tr>
                        </table>
                      </td>
                      <td className="text-center w-5">
                        <i className="fas fa-file-download fa-3x"/>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-center w-15">
                        <img src="assets/img/LogoGeneral.svg" className="card-img"
                                                            alt="Titulo"/>
                      </td>
                      <td>
                        <table className="w-100 table-borderless fondoceleste rounded-pill">
                          <tr>
                            <td className="p-2">dato</td>
                            <td className="p-2 border-y">dato</td>
                            <td className="p-2">dato</td>
                          </tr>
                        </table>
                      </td>
                      <td className="text-center w-5">
                        <i className="fas fa-file-download fa-3x"/>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-center w-15">
                        <img src="assets/img/LogoAna.svg" className="card-img"
                                                            alt="Titulo"/>
                      </td>
                      <td>
                        <table className="w-100 table-borderless fondoceleste rounded-pill">
                          <tr>
                            <td className="p-2">dato</td>
                            <td className="p-2 border-y">dato</td>
                            <td className="p-2">dato</td>
                          </tr>
                        </table>
                      </td>
                      <td className="text-center w-5">
                        <i className="fas fa-file-download fa-3x"/>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-center w-15">
                        <img src="assets/img/LogoBanorte.svg" className="card-img"
                                                            alt="Titulo"/>
                      </td>
                      <td>
                        <table className="w-100 table-borderless fondoceleste rounded-pill">
                          <tr>
                            <td className="p-2">dato</td>
                            <td className="p-2 border-y">dato</td>
                            <td className="p-2">dato</td>
                          </tr>
                        </table>
                      </td>
                      <td className="text-center w-5">
                        <i className="fas fa-file-download fa-3x"/>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-center w-15">
                        <img src="assets/img/LogoHdi.svg" className="card-img"
                                                            alt="Titulo"/>
                      </td>
                      <td>
                        <table className="w-100 table-borderless fondoceleste rounded-pill">
                          <tr>
                            <td className="p-2">dato</td>
                            <td className="p-2 border-y">dato</td>
                            <td className="p-2">dato</td>
                          </tr>
                        </table>
                      </td>
                      <td className="text-center w-5">
                        <i className="fas fa-file-download fa-3x"/>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-center w-15">
                        <img src="assets/img/LogoPotosi.svg" className="card-img"
                                                            alt="Titulo"/>
                      </td>
                      <td>
                        <table className="w-100 table-borderless fondoceleste rounded-pill">
                          <tr>
                            <td className="p-2">dato</td>
                            <td className="p-2 border-y">dato</td>
                            <td className="p-2">dato</td>
                          </tr>
                        </table>
                      </td>
                      <td className="text-center w-5">
                        <i className="fas fa-file-download fa-3x"/>
                      </td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
            {/*<div className="row flex-grow-1 headbotton">*/}
              {/*<div className="col fondoAzul"/>*/}
            {/*</div>*/}
          </React.Fragment>
            : null
        }
        <div className="row flex-grow-1 headbotton">
          <div className="col fondoAzul"/>
        </div>
      </div>
  );
};

export default Home;
