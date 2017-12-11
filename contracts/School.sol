pragma solidity ^0.4.2;
import "./ReportCard.sol";
contract School {
    bytes32 public schoolName ;

   event GradesSubmitted(string gs );

    //todo change to multiple teachers
    //As is this is more of a school class contract
    //Add semester designation

    address public teacher;
    uint numReportCards;

    mapping(address => uint) reportCard; //todo remove

    mapping(uint => ReportCardStruct) idReportCardMap;
    mapping(address => uint) addressReportCardMap;

    function School (bytes32 name) payable {
        schoolName = name;
    }

    struct ReportCardStruct {
        address reportCardAddress;                          //address of Report Card Contract
        string studentName;
        string[] subjectList;
        mapping(string => uint) subjectGradeMapping;       //grades  of student
    }

    string[] emptySubjectList;

    function registerReportCard( string name, ReportCard rc) {
        uint studentId = numReportCards++;
        idReportCardMap[studentId] = ReportCardStruct(  rc, name, emptySubjectList);
        addressReportCardMap[rc] = studentId;
        registerTeacher(rc);
    }

    function registerTeacher(ReportCard rc) {
        rc.assignTeacher(rc);
    }


    function getNumberOfReportCards() returns (uint ret) {
        return numReportCards;
    }

     function enterGrades(address rca, string subject, uint _grade) {
            if (idReportCardMap[addressReportCardMap[rca]].subjectGradeMapping[subject] == 0) {
                idReportCardMap[addressReportCardMap[rca]].subjectList.push(subject);
            }
            idReportCardMap[addressReportCardMap[rca]].subjectGradeMapping[subject] = _grade;
    }

    function submitReportCard(ReportCard rc) {

        GradesSubmitted("GradesSubmitted");
        rc.setGPA(calculateGPA(rc));

    }

    function calculateGPA(address rca) returns (uint ret) {
        string memory subject;
        uint grade;
        uint score;
        uint noof = idReportCardMap[addressReportCardMap[rca]].subjectList.length;
        uint gpa;

          for(uint i=0;i<noof-1;i++){
                subject= idReportCardMap[addressReportCardMap[rca]].subjectList[i];
                grade = idReportCardMap[addressReportCardMap[rca]].subjectGradeMapping[subject];
                score += grade * 100;
          }
          gpa = score;
        return (gpa);
    }

    function listGrade(address rca, string subject ) returns (uint ret) {
        return uint(idReportCardMap[addressReportCardMap[rca]].subjectGradeMapping[subject]);
    }

    function listGrades(address rca, uint num) returns (uint gr, string subject) {
      //string memory subject;
      uint grade;
      subject = idReportCardMap[addressReportCardMap[rca]].subjectList[num];
      grade = idReportCardMap[addressReportCardMap[rca]].subjectGradeMapping[subject];
      return ( grade, subject );
    }

    function getNumberOfGrades(address rca) returns (uint ret) {
        return idReportCardMap[addressReportCardMap[rca]].subjectList.length;
    }

    function setTeacher(address ta){
        teacher = ta;
    }

    function getSchoolName() constant returns (bytes32) {
        return schoolName;
    }

    function getStudentNumber(address rca) constant returns(uint) {
        return addressReportCardMap[rca];
    }

    function getStudentNameByAddress(address rca) constant returns(string){
        return idReportCardMap[addressReportCardMap[rca]].studentName;
    }

    function getStudentNameById(uint number) constant returns(string){
        return idReportCardMap[number].studentName;
    }

    function getStudentInfoById(uint number) constant returns(string, address) {
      return (idReportCardMap[number].studentName, idReportCardMap[number].reportCardAddress);
    }

}