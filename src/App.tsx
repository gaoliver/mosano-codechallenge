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
interface users {
  id: number;
  name: string;
  surname: string;
  country: string;
  birthday: string;
  date: Date
}

export default function App() {
  const [person, setPerson] = useState<person>()
  const [countries, setCountries] = useState<[countries]>()
  const [theCountry, setTheCountry] = useState("")
  const [birthday, setBirthday] = useState<Date>()
  const [users, setUsers] = useState<users[]>([])
  const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
  const [message, setMessage] = useState("")

  useEffect(() => {
    axios.get('https://restcountries.eu/rest/v2/all')
      .then((response) => setCountries(response.data))
  }, [])

  const saving = async () => {
    saveUser()
  }

  function saveUser() {
    if (person && theCountry && birthday) {

      const theId = Math.round(Math.random() * 100)

      console.log(theId)

      setUsers((dados) => [...dados, {
        id: theId,
        ...person,
        country: theCountry,
        birthday: (birthday.getUTCDate() < 10 ? "0" + birthday.getUTCDate().toString() : birthday.getUTCDate().toString()) + "/" + ((birthday.getUTCMonth() + 1) < 10 ? "0" + (birthday.getUTCMonth() + 1).toString() : (birthday.getUTCMonth() + 1).toString()) + "/" + birthday.getFullYear().toString(),
        date: birthday
      }])

      console.log(users)

      setPerson({ name: "", surname: "" })
      setBirthday(new Date())

      // Message | I did this way because this project have no back-end and redux for realtime update of the array
      setMessage(`Hello ${person.name} from ${theCountry}, on ${birthday.getUTCDate().toString()} of ${monthNames[birthday.getUTCMonth()]} you will have ${(new Date().getUTCFullYear() - birthday.getUTCFullYear()).toString()} years.`)
    }
  }

  const getMessage = (personId: number) => {
    const person = users.find(user => user.id === personId)

    setMessage(`Hello ${person?.name} from ${person?.country}, on ${person?.date.getUTCDate().toString()} of ${monthNames[person?.date.getUTCMonth() ? person?.date.getUTCMonth() : 0]} you will have ${(new Date().getUTCFullYear() - (person?.date.getUTCFullYear() ? person?.date.getUTCFullYear() : 0)).toString()} years.`)
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
                <Input type="date" onChange={(date) => setBirthday(new Date(date.target.value))} />
              </Col>
            </Row>
            {/* Botão salvar */}
            <Row className="button">
              <button onClick={() => saving()}>Save</button>
            </Row>
            <Row>
              {message &&
                (<p>{message}</p>)}
            </Row>
          </Col>
          <Col>
            <Table hover>
              <thead>
                <tr>
                  <th>name</th>
                  <th>country</th>
                  <th>birthday</th>
                </tr>
              </thead>
              <tbody>
                {users?.map(user => (
                  <tr className="listNames" onClick={() => getMessage(user.id)}>
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
