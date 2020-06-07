import React from 'react';
import logo from '../../assets/logo.svg';
import { Link } from 'react-router-dom';
import { FiArrowLeft }from 'react-icons/fi'
import { Map, TileLayer, Marker } from 'react-leaflet';


import './styles.css';

const Create = () => {
    return (
        <div id="page-create-point">
            <header>
                <img src={ logo } alt="logo"/>

                <Link to="/">
                    <FiArrowLeft />
                    Voltar para o inicio
                </Link>
            </header>

            <form>
                <h1>Cadastro do ponto de coleta</h1>
                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>

                    <div className="field">
                        <label htmlFor="name">Informe o nome do ponto de coleta</label>
                        <input type="text" name="name" id="name"/>
                    </div>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <input type="email" name="email" id="email"/>
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input type="text" name="whatsapp" id="whatsapp"/>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione um endereço no mapa</span>
                    </legend>
                    <Map center={[-8.7522849, -63.8672392]} zoom={15}>
                        <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[-8.7522849, -63.8672392]}>
                        </Marker>
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado</label>
                            <select name="uf" id="uf">
                                <option value="0">Selecione uma UF</option>
                            </select>
                        </div>

                        <div className="field">
                            <label htmlFor="cidade">Cidade</label>
                            <select name="cidade" id="cidade">
                                <option value="0">Selecione uma cidade</option>
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
                        <li>
                            <img src="http://localhost:3333/uploads/lampadas.svg" alt="lampada"/>
                            <span>Lâmpada</span>
                        </li>

                        <li className="selected">
                            <img src="http://localhost:3333/uploads/oleo.svg" alt="oleo"/>
                            <span>Óleo de Cozinha</span>
                        </li>

                        <li>
                            <img src="http://localhost:3333/uploads/baterias.svg" alt="baterias"/>
                            <span>Pilhas e Baterias</span>
                        </li>

                        <li>
                            <img src="http://localhost:3333/uploads/papeis-papelao.svg" alt="papeis-papelao"/>
                            <span>Papéis e Papelão</span>
                        </li>

                        <li>
                            <img src="http://localhost:3333/uploads/eletronicos.svg" alt="eletronicos"/>
                            <span>Resíduos Eletrônicos</span>
                        </li>

                        <li>
                            <img src="http://localhost:3333/uploads/organicos.svg" alt="organicos"/>
                            <span>Resíduos Orgânicos</span>
                        </li>
                    </ul>
                </fieldset>
            </form>

        </div>
    );
};

export default Create;