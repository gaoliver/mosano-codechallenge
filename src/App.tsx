import React, { useState, useEffect } from 'react';
import { Row, Container, Col, Table } from "react-bootstrap"
import { Input, Jumbotron } from "reactstrap"
import axios from "axios"

import './App.css';

interface person { 
  name: string; 
  surname: string 
}
interface countries {
  name: string
}
interface birthday {
  day: number;
  month: number;
  year: number
}
interface users {
  id: number;
  name: string;
  surname: string;
  country: string;
  birthday: string;
}

export default function App() {
  const [person, setPerson] = useState<person>()
  const [countries, setCountries] = useState<[countries]>()
  const [theCountry, setTheCountry] = useState("")
  const [birthday, setBirthday] = useState("")
  const [theDate, setTheDate] = useState<birthday>()
  const [users, setUsers] = useState<users[]>([])

  useEffect(() => {
    axios.get('https://restcountries.eu/rest/v2/all')
      .then((response) => setCountries(response.data))
  }, [])

  function maskBirthday(str: string) {
    return str.replace(/[^0-9]/g, "").replace(/(\d{2})(\d{2})(\d)/, "$1/$2/$3")
  }

  const splitDate = () => {
    const separate = birthday.split("/", 3)
    
    const day = separate[0];
    const month = separate[1];
    const year = separate[2];

    setTheDate({
      day: parseInt(day),
      month: parseInt(month),
      year: parseInt(year)
    })
    
    console.log("dia: " + day + "\nMês: " + month + "\nAno: " + year)
  }

  const saving = async () => {
    await splitDate();
    saveUser()
  }

  function saveUser() {
    if (person && theCountry && birthday) {

      setUsers((dados) => [...dados, {
        id: Math.random(),
        ...person,
        country: theCountry,
        birthday: birthday,
        date: theDate
      }])

      console.log(users)

      setPerson({ name: "", surname: "" })
      setTheCountry("")
      setBirthday("")
    }
  }

  return (
    <Jumbotron className="webPage">
      <Container className="App-header">
        <Row>
          <Col lg="5">
            {/* Nome */}
            <Row className="label">
              <Col>
                Name:
              </Col>
              <Col>
                <Input placeholder="name here" value={person?.name} onChange={(text) => setPerson({ name: text.target.value, surname: person?.surname || "" })}></Input>
              </Col>
            </Row>
            {/* Sobrenome */}
            <Row className="label">
              <Col>
                Surname:
              </Col>
              <Col>
                <Input placeholder="name here" value={person?.surname} onChange={(text) => setPerson({ name: person?.name || "", surname: text.target.value })}></Input>
              </Col>
            </Row>
            {/* País */}
            <Row className="label">
              <Col>
                Country:
              </Col>
              <Col>
                <select value={theCountry !== "" ? theCountry : undefined} onChange={(text) => setTheCountry(text.target.value)}>
                  <option disabled selected hidden>Countries</option>
                  {countries?.map(x => (
                    <option value={x.name}>{x.name}</option>
                  ))}
                </select>
              </Col>
            </Row>
            {/* Aniversário */}
            <Row className="label">
              <Col>
                Birthday:
              </Col>
              <Col>
                <Input placeholder="dd/mm/yyyy" maxLength={10} value={maskBirthday(birthday)} onChange={(text) => setBirthday(maskBirthday(text.target.value))}></Input>
              </Col>
            </Row>
            {/* Botão salvar */}
            <Row className="button">
              <button onClick={() => saving()}>Save</button>
            </Row>
          </Col>
          <Col>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Country</th>
                  <th>Birthday</th>
                </tr>
              </thead>
              <tbody>
                {users?.map(user => (
                    <tr>
                      <td>{user.name + " " + user.surname}</td>
                      <td>{user.country}</td>
                      <td>{user.birthday}</td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </Jumbotron>
  );
}
