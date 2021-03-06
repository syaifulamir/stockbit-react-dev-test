import React, {useEffect, useState} from 'react';
import {connect, useDispatch, useSelector} from 'react-redux';
import { Table, Button, Form, FormText } from 'react-bootstrap';
import * as Actions from "../store/actions";
import { useHistory } from "react-router-dom";
import Autocomplete from '../components/Autocomplete';

function Listing(props)
{
    const dispatch = useDispatch();
    const history = useHistory();

    const films = useSelector(state => state.films);

    window.onscroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
            let paramsChanges = { ...params, page: params.page + 1 };
            setParams(paramsChanges);
            dispatch(Actions.getList(paramsChanges));
        }
    }

    useEffect(() => {
        dispatch(Actions.getList(params));
    }, [dispatch]);

    const [params, setParams] = useState(films.params);
    const [imgUrl, setImgUrl] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [isShow, setIsShow] = useState(true);

    const [typingTimeout, setTypingTimeout] = React.useState(0);
    const handleChangeSearch = (value) => {
        const paramsChanges = { ...params, s: value, page: 1 };
        setParams(paramsChanges);
        setIsShow(true);

        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }
        setTypingTimeout(setTimeout(() => {
            dispatch(Actions.getList(paramsChanges));
        }, 500));
    };

    const handleDetail = (item) => {
        dispatch(Actions.getSelected(item));
        history.push("/detail/" + item.imdbID);
    }

    const handleShowImage = (value) => {
        setImgUrl(value);
        setIsOpen(true);
    }

    const handleCloseImage = () => {
        setIsOpen(false);
    }

    return (
        <div>
            <div style={{ padding: 10 }}>
                <Autocomplete 
                    placeholder='Search'
                    suggestions={suggestions}
                    onChange={handleChangeSearch}
                    params={params}
                    isShow={isShow}
                />
            </div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Year</th>
                        <th>Type</th>
                        <th>Poster</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        films.datas && films.datas.length > 0 ? 
                        films.datas.map((item, index) => {
                            return (
                                <tr>
                                    <td>{index + 1}</td>
                                    <td>{item.imdbID}</td>
                                    <td>{item.Title}</td>
                                    <td>{item.Year}</td>
                                    <td>{item.Type}</td>
                                    <td>
                                        <img src={item.Poster} width={100} onClick={() => {
                                            handleShowImage(item.Poster)
                                        }}/> 
                                    </td>
                                    <td>
                                        <Button size={'small'} onClick={() => {
                                            handleDetail(item);
                                        }}>Detail</Button>
                                    </td>
                                </tr>
                            )
                        }) : (
                            <tr>
                                <td colSpan={7} align={'center'}>Tidak ada data</td>
                            </tr>
                        )
                    }
                </tbody>
            </Table>
            {
                (isOpen) && (
                    <dialog
                        style={{
                            left: '0',
                            top: '0',
                            width: '20%',
                            position: "absolute",
                            margin: '0 auto',
                            border: 0
                        }}
                        open
                        onClick={handleCloseImage}
                    >
                        <img
                            src={imgUrl}
                            onClick={handleCloseImage}
                            alt="no image"
                        />
                        * Click to close
                    </dialog>
                )
            }
        </div>
    );
}

Listing = connect()(Listing)

export default Listing;
