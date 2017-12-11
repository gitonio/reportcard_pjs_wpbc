pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/School.sol";
import "../contracts/ReportCard.sol";

contract TestSchool {

  uint public initialBalance = 1 ether;


  function testInitialTeacherAddressUsingDeployedContract() {
    School sc = School(DeployedAddresses.School());

    address expected = 0x0;

    Assert.equal(sc.teacher(), expected, "Teacher address should be zero initially");
  }

  function testsetTeacherAddressUsingDeployedContract() {
    School sc = School(DeployedAddresses.School());
    address expected = 0x0;

    Assert.equal(sc.teacher(), expected, "Teacher address should be zero initially");
    sc.setTeacher(0x1);
    expected = 0x1;

    Assert.equal(sc.teacher(), expected, "Teacher address should be 1");
  }

  function testEmptyReportCard() {
    School sc = School(DeployedAddresses.School());
    sc.setTeacher(0x1);
    address expected = 0x1;

    Assert.equal(sc.teacher(), expected, "Teacher address should be 1");

    Assert.equal(sc.getNumberOfReportCards(),0, "There should be no report cards");

    ReportCard rc = new ReportCard(0x2,'Novak');
    rc.enroll(School(DeployedAddresses.School()),'Novak');

    Assert.equal(sc.getNumberOfReportCards(),1, "There should be a report card");

    //Assert.equal(sc.getStudentName(rc),'Novak','Novak should be enrolled');

  }

  function testEnterGrades() {
    School sc = School(DeployedAddresses.School());

    address expected = 0x1;

    Assert.equal(sc.teacher(), expected, "Teacher address should be 1");

    Assert.equal(sc.getNumberOfReportCards(),1, "There should be a report card");

    ReportCard rc = new ReportCard(0x2,'Novak');
    rc.enroll(School(DeployedAddresses.School()),'Novak');

    Assert.equal(sc.getNumberOfReportCards(),2, "There should be a report card");

    rc.contribute();
    sc.enterGrades(DeployedAddresses.ReportCard(),'Math',1 );

  }

  function testSchoolName() {
     School sc = School(DeployedAddresses.School());
     bytes32 expected = 'Test School';

    Assert.equal(sc.getSchoolName(), expected, "Teacher address should be zero initially");
  }

}