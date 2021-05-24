import React from 'react';
import axios from 'axios';
import Select from 'react-select';
import Loader from "react-loader-spinner";

const Bank = props => (
  <tr>
    <td>{props.bank.bank_id}</td>
    <td>{props.bank.bank_name}</td>
    <td>{props.bank.branch}</td>
    <td>{props.bank.district}</td>
    <td>{props.bank.city}</td>
  </tr>
)

const excludeColumns = ["bank_id", "ifsc"];
const excludeColumns1 = ["bank_id", "ifsc", "bank_name", "branch", "address"];


var banks = []

const options = [
  { value: 'Greater Mumbai', label: 'Greater Mumbai' },
  { value: 'Greater Bombay', label: 'Greater Bombay' },
  { value: 'Thane', label: 'Thane' },
  { value: 'Raigad', label: 'Raigad' },
  { value: 'Jalgaon', label: 'Jalgaon' },
  { value: 'None', label: 'None' },
];

export default class App extends React.Component {

  
  constructor(props) {
    super(props);
    this.state = { copyBanks:[], searchText: '', district: '', districtBanks: [], selectedOption: null}
    this.handleChange=this.handleChange.bind(this);
  }

  componentDidMount() {
    axios.get('https://vast-shore-74260.herokuapp.com/banks?city=MUMBAI')
      .then(response => {
        banks = response.data
        console.log(banks)
        this.setState({copyBanks: banks, districtBanks: banks})
      
      })
      .catch((error) => {
        console.log(error);
      })
  }


  bankList() {
    return this.state.copyBanks.map(currentbank => {
      return <Bank bank={currentbank} key={currentbank._id}/>;
    })
  }

  filterData = (value) => {
    const lowercasedValue = value.toLowerCase().trim();
    if (lowercasedValue === ""){
      this.setState({ copyBanks: this.state.districtBanks});
      console.log(this.state.copyBanks)
    }
    else {
      const filteredData = this.state.districtBanks.filter(item => {
        return Object.keys(item).some(key =>
          excludeColumns.includes(key) ? false : item[key].toString().toLowerCase().includes(lowercasedValue)
        );
      });
      console.log(filteredData)
      this.setState({ copyBanks: filteredData});
    }
  }

  filterDistrictData = (value) => {
    const lowercasedValue = value.toLowerCase().trim();
      const filteredData = banks.filter(item => {
        return Object.keys(item).some(key =>
          excludeColumns1.includes(key) ? false : item[key].toString().toLowerCase().includes(lowercasedValue)
        );
      });
      console.log(filteredData)
      this.setState({ districtBanks: filteredData, copyBanks: filteredData });
  }

  handleChange = (value) => {
    this.setState({ searchText: value})
    this.filterData(value);
  };

  handleChangeforSelect = selectedOption => {
    this.setState({ selectedOption });
    console.log(`Option selected:`, selectedOption.value);
    this.filterDistrictData(selectedOption.value);
  };

  render() {
    const { selectedOption } = this.state;
    return (
      <div>
        
                
        <nav>
          <div class="nav-wrapper black">
          <a href="#" class="brand-logo center">Bank Search</a>
        </div>
      </nav>
      <div class="container">
      <div class="row">
      <div class="col s6">
      &nbsp;&nbsp;
      <Select
        value={selectedOption}
        onChange={this.handleChangeforSelect}
        options={options}
      />
      </div>
      <div class="row">
        <div class="input-field col s6">
          <i class="material-icons prefix">search</i>
          <input id="icon_prefix" type="text" 
          class="validate" selectedValue={this.state.searchText} 
          onChange={e => this.handleChange(e.target.value)}/>
          <label for="icon_prefix">Search</label>
        </div>
      </div>
    </div>
        <table class="responsive-table striped centered">
          <thead className="thead-light">
          {
                      (this.state.copyBanks=="")
                    ?<center><Loader
                    type="TailSpin"
                    color="blue"
                    height={100}
                    width={100}
                    timeout={20000} //3 secs
                  /></center>
                    :
            <tr>
              <th>Bank_Id</th>
              <th>Bank name</th>
              <th>Branch</th>
              <th>District</th>
              <th>City</th>
            </tr>}
          </thead>
          <tbody>
                 {this.bankList() }
            
          </tbody>
        </table>
        </div>
        <div>
      </div>
      </div>
    )
  }
}