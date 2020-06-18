import React, { useEffect, useState, FormEvent, ChangeEvent, InputHTMLAttributes } from 'react';
import logo from '../../assets/logo.svg';
import { Link } from 'react-router-dom';
import { FiArrowLeft }from 'react-icons/fi'
import { Map, TileLayer, Marker } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import axios from 'axios';

import api from '../../services/api';
import './styles.css';
import { Item } from '../../interfaces/Item';
import { State } from '../../interfaces/State';
import { City } from '../../interfaces/City';
import Dropzone from '../../components/dropzone/dropzone';


const Create = () => {
    const[ items, setItems ] = useState<Item[]>([]);
    const[ states, setStates ] = useState<State[]>([]);
    const[ citiesName, setCitiesNames ] = useState<City[]>([]);
    const[ selectedPosition, setSelectedPosition ] = useState<[number, number]>([0, 0]);
    const[ initialPosition, setInitialPosition ] = useState<[number, number]>([0, 0]);
    const[ selectedUf, setSelectedUf ] = useState('0');
    const[ selectedCity, setSelectedCity ] = useState('0');
    const[ selectedItems, setSelectItems ] = useState<number[]>([]);
    const[ selectedImage, setSelectedImage ] = useState();


    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: ''
    });


    useEffect(() => {
        
        navigator.geolocation.getCurrentPosition(position => {
            const {latitude, longitude} = position.coords;

            setInitialPosition([latitude, longitude]);
        });
    }, []);

    useEffect(() => {
        api.get('items').then(response => {
            setItems(response.data);
        });
    }, []);
    
    useEffect(() => {
        axios.get<State[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
        .then(response => {
            const responseStates = response.data;

            setStates(responseStates);
            
        });
    }, []);

    useEffect(() => {
        if (selectedUf === '0') 
        {
            return;
        }

        axios
            .get<City[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
            .then(response => { 
                const responseCity = response.data;

                setCitiesNames(responseCity)
             });
    }, [selectedUf]);

    const handlerState = (event: ChangeEvent<HTMLSelectElement>) => {
        const stateSelect = event.target.value;
        let uf = '';
        states.map(state => {
            if(state.nome === stateSelect) {
                uf = state.sigla;
            }
        });

        setSelectedUf(uf);
        
    };

    const handlerCity = (event: ChangeEvent<HTMLSelectElement>) => {
        const citySelect = event.target.value;

        setSelectedCity(citySelect);
        
    };

    const handlerMapClick = (event: LeafletMouseEvent) => {
        setSelectedPosition([event.latlng.lat, event.latlng.lng]);
        
    };

    const handlerInput = (event: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;

        setFormData({ ...formData, [name]: value });
        
        
    };

    const handlerSelectItem = (id: number) => {
        const alreadySelected = selectedItems.findIndex(item => item === id);
        console.log('items selecionados', selectedItems);
        
        console.log('já selecionado', alreadySelected);
        

        if (alreadySelected >= 0) {
            const filteredItems = selectedItems.filter(item => item !== id);
            console.log('itens filtrado', filteredItems);
            

            setSelectItems(filteredItems);
            return;
        }

        setSelectItems([...selectedItems, id]);
        

    };

    const handlerSubmit = async (event: FormEvent) => {
        event.preventDefault();
          
        const { name, email, whatsapp } = formData;
        const [ latitude, longitude ] = selectedPosition;
        const city  = selectedCity;
        const uf  = selectedUf;
        const items = selectedItems;
        
        const data = new FormData();

        data.append('name', name);
        data.append('email', email);
        data.append('whatsapp', whatsapp);
        data.append('uf', uf);
        data.append('city', city);
        data.append('latitude', String(latitude));
        data.append('longitude', String(longitude));
        data.append('items', items.join(','));
        if (selectedImage) {
            data.append('image', selectedImage!);
        }

        await api.post('points', data);

        alert('point created');

    
    }

    return (
        <div id="page-create-point">
            <header>
                <img src={ logo } alt="logo"/>

                <Link to="/">
                    <FiArrowLeft />
                    Voltar para o inicio
                </Link>
            </header>

            <form onSubmit={ handlerSubmit }>
                <h1>Cadastro do ponto de coleta</h1>

                <Dropzone onFileUpload={ setSelectedImage } />
                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>

                    <div className="field">
                        <label htmlFor="name">Informe o nome do ponto de coleta</label>
                        <input 
                        type="text"
                        name="name" 
                        id="name" 
                        onBlur={handlerInput} />
                    </div>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <input 
                            type="email"
                            name="email"
                            id="email"
                            onBlur={handlerInput} />
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input 
                            type="text"
                            name="whatsapp"
                            id="whatsapp"
                            onBlur={handlerInput} />
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione um endereço no mapa</span>
                    </legend>
                    <Map center={initialPosition} zoom={15} onClick={ handlerMapClick }>
                        <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={selectedPosition}>
                        </Marker>
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="state">Estado</label>
                            <select 
                            name="state"
                            id="state"
                            onChange={ handlerState }>
                                <option value="0">Selecione um Estado</option>
                                    { states.map(state => {
                                        return (
                                            <option key={ state.sigla } value={ state.nome }>
                                                { state.nome }
                                            </option>
                                        );
                                }) }
                            </select>
                        </div>

                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select 
                            name="city" 
                            id="city"
                            value={ selectedCity }
                            onChange={ handlerCity }>
                                <option value="0">Selecione uma cidade</option>
                                { citiesName.map(city => {
                                    return (
                                    <option  key={ city.nome } value={ city.nome }>
                                        { city.nome }
                                    </option>
                                    );
                                }) }
                                
                            </select>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Ítens para coleta</h2>
                        <span>Selecione um ou mais</span>
                    </legend>

                    <ul className="items-grid">                        
                    { items.map(item => {
                        return (
                            <li 
                                key={ item.id } 
                                onClick={() => handlerSelectItem(item.id) }
                                className={ selectedItems.includes(item.id) ? 'selected' : '' }>
                                <img src={ item.image_url } alt={ item.title }/>
                                <span>{ item.title }</span>
                            </li>
                        );
                    }) }
                    </ul>
                </fieldset>
                <button type="submit">
                    Cadastrar ponto de coleta
                </button>
            </form>

        </div>
    );
};

export default Create;