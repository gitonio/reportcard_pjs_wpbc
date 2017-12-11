pragma solidity ^0.4.2;
import "./School.sol";
contract ReportCard {

    //address public student;         //address to remit proceeds to if goal is met

    struct StudentStruct {
      address student;
      string studentName;
    }

    StudentStruct public stud;

    address teacher;                //address that submits grades
    address public parent;                 //address of parent
    uint gpa;                       //gpa acheived
    uint public gpaGoal;            //gpa goal
    bool public submitted;          //has teacher submitted grades

    uint numContributors;
    mapping (uint => address) contributors;
    mapping (address => uint) balances;

    event RewardDisbursement (string rd);

    function ReportCard  (address stu, string name) payable {
        parent = msg.sender;
        stud = StudentStruct(stu, name);
    }

    function assignTeacher (address _teacher) {
        teacher = _teacher;
    }

    function setGPA(uint _gpa) {
        //todo limit who can set to teacher
        gpa = _gpa;
        submitted = true;
    }

    function setGPAGoal (uint _gpa) {
        //todo limit who can set to parent/owner
       gpaGoal = _gpa;
    }

    function enroll(School school, string name) {
        //todo limit who can set to parent/owner
        school.registerReportCard( name, this);
    }

    function contribute() payable {
        balances[msg.sender] += msg.value;
    }

    function getBalance(address ad) returns (uint ret) {
        //todo limit who can set to contributor
        return balances[ad];
    }

    function getReportCardBalance() returns (uint ret) {
        //todo limit who can set to parent/owner/student
        return this.balance;
    }


    function getGPA() returns (uint ret) {
        //todo limit who can set to parent/owner/student
        return gpa;
    }

    function getGPAGoal() returns (uint ret) {
        //todo limit who can set to parent/owner/student
        return gpaGoal;
    }

    function getStudentName() returns (string ret) {
      return stud.studentName;
    }

    function getStudentAddress() returns (address ret) {
      return stud.student;
    }

    function getReward () {
        //todo limit who can set to parent/owner/student
        if ((gpa >= gpaGoal) && (submitted)) {
            if (!stud.student.send( this.balance )) {
                throw;
            }
            RewardDisbursement("Award sent");
            return;
        }
        if ((gpa < gpaGoal) && (submitted)) {
            giveRefund;
            return;
        }
    }

    function giveRefund () {
        if ((gpa < gpaGoal) && (submitted)) {
            //giveRefund;
            for (var index = 0; index < numContributors; index++) {
                if (!contributors[index].send( balances[contributors[index]] )) {
                throw;
            }

            }
            return;
        }

    }

}