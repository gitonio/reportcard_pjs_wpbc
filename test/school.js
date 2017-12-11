var School = artifacts.require("./School.sol");
var ReportCard = artifacts.require("./ReportCard.sol");

contract('School and ReportCard', function(accounts) {

  var school;
  var rc;


  it("School Should Not have a teacher initially", function() {
    return School.new("Bay Park").then(function(instance) {
      school = instance;
      //console.log('school', school);
      return school.teacher.call();
    }).then(function(teacher) {
      assert.equal(teacher.valueOf(), 0x0, "There was a teacher");
    });
  });

  it("School should have a name", function() {
    school.schoolName.call().then(function(name){
      var expected = 'Bay Park\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000';
      assert.equal(web3.toAscii(name),expected,"School did not have a name");
    })
  })

  it("School Admin Should be able to set a teacher", function() {
    return school.setTeacher(0x1).then(function() {
      return school.teacher.call();
    }).then(function(teacher){
      assert.equal(teacher.valueOf(), 0x1, "There was no teacher");
    });
  });

  it("School Should not have a report card initially", function() {
    return school.getNumberOfReportCards.call().then(function(noof){
      assert.equal(noof, 0 ,"There was a report card");
    });
  });


  it("ReportCard Should  enroll a student in School", function() {
    return ReportCard.new(accounts[2],'Novak').then(function(instance){
      rc = instance;
      //console.log('rc:', rc)
      return rc.enroll(school.address, 'Novak');
    }).then(function(){
      //return rc.student.call();
      return school.getStudentNumber.call(rc.address);
    }).then(function(result){
      //console.log("sn:" , result.valueOf());
      assert.equal(result,0, "Not correct student");
      return school.getStudentNameByAddress.call(rc.address);
    }).then(function(result){
      assert.equal(result,'Novak','Not correct student name');
      return school.getStudentNameById.call(0);
    }).then(function(result){
      assert.equal(result,'Novak','Not correct student');
    });
  });

  it("ReportCard Should  enroll a second student in School", function() {
    return ReportCard.new(accounts[3],'Skylar').then(function(instance){
      rc = instance;
      return rc.enroll(school.address, 'Skylar');
    }).then(function(){
      //return rc.student.call();
      return school.getStudentNumber.call(rc.address);
    }).then(function(result){
      //console.log(result);
      assert.equal(result,1, "Not correct student id");
      return school.getStudentNameByAddress.call(rc.address);
    }).then(function(result){
      assert.equal(result,'Skylar', "Not correct student name");
      return school.getStudentNumber.call(rc.address);
    }).then(function(result){
      //console.log('student number', result.valueOf());
      return school.getStudentNameById.call(1);
    }).then(function(name){
      assert.equal(name,'Skylar','Not correct student');
    });
  });

  it("School Should  have two report cards", function() {
    return school.getNumberOfReportCards.call().then(function(noof){
      assert.equal(noof.valueOf(), 2 ,"There was no report card");
    });
  });

  it("ReportCard should accept a contribution", function(){

    rc.contribute( {from: accounts[1], value: 100} ).then(function(){
        return rc.getBalance.call(accounts[1]);
    }).then(function(bal){
      assert.equal(bal, 100, "There was a diff balance");
    });

  });

  it("Reportcard should return report card balance", function(){
    rc.getReportCardBalance.call().then(function(bala){
      assert.equal(bala, 100, "There was a diff balance");
    });

  });

  it("Reportcard should return contributor balance", function() {
    rc.getBalance.call(accounts[1]).then( function(bal) {
      assert.equal(bal,100, "There was a diff balance");
    });
  });

  it("Reportcard should return a name", function() {
    rc.getStudentName.call(accounts[1]).then( function(ret){
      assert.equal(ret,'Skylar', 'Incorrect name');
    });
  });

  it("Reportcard should return student address", function(){
    rc.getStudentAddress.call().then( function(ret){
      assert.equal(ret, accounts[3],'Incorrect student address');
    })
  })

  it("Reportcard should return student address", function(){
    rc.getStudentAddress.call().then( function(ret){
      assert.equal(ret, accounts[3],'Incorrect student address');
    })
  })

 it("School Teacher should be able to enter grades", function(){
   return school.enterGrades(rc.address, 'Math', 4, {gas: 500000}).then(function(){

    return school.listGrade.call(rc.address, 'Math' );
    }).then(function(grade){
      assert.equal(grade.valueOf(), 4, "Grade was incorrect");
      return school.enterGrades(rc.address, 'Reading', 3);
    }).then(function(){
      return school.listGrade.call(rc.address, 'Reading' );
    }).then(function(grade){
      assert.equal(grade.valueOf(),3, "Grade was incorrect");
      return school.getNumberOfGrades.call(rc.address);
    }).then(function(noof){
      assert.equal(noof.valueOf(),2,"Number of grades incorrect")
    });

  });



  it("School should calculate and submit GPA", function(){

    return school.submitReportCard(rc.address).then(function(result){
      var found_published_event = false;

      for (var i = 0; i < result.logs.length; i++) {
        var log = result.logs[i];
        if (log.event == "GradesSubmitted") {
          found_published_event = true;
          break;
        }
      }

      assert(found_published_event, "No grade was submitted!")

      return rc.getGPA.call();
    }).then(function(gpa){
     assert.equal(gpa.valueOf() , 400, "GPA incorrect");
    });


  });


 it("ReportCard should accept a GPA goal", function(){
    return rc.setGPAGoal(300).then(function(){
      return rc.gpaGoal.call();
      }).then(function(goal){
        assert.equal(goal.valueOf(), 300, "gpa Goal incorrect");
    });
  });


  it("ReportCard should payout if GPA goal is met",function(){
    return rc.getReward().then(function(result){
      var found_published_event = false;

      for (var i = 0; i < result.logs.length; i++) {
        var log = result.logs[i];
        if (log.event == "RewardDisbursement") {
          found_published_event = true;
          break;
        }
      }

      assert(found_published_event, "No reward was distributed!")
    });
  });
});