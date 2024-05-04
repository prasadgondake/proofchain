// SPDX-License-Identifier: GPL-
pragma solidity >=0.5.0 <0.9.0;
 contract ChainOfCustody {
struct Evidence {
 bytes32 ID;
 address owner ;
 address creator ;
 string description ;
 address [] taddr ;
 uint [] ttime ;
 string evidenceArray;
 }

 mapping ( bytes32 => Evidence ) private evidences ;

 modifier OnlyOwner ( bytes32 ID) {
 require (msg . sender == evidences [ID ]. owner ) ;
 _;
}

 modifier OnlyCreator ( bytes32 ID) {
 require (msg . sender == evidences [ID ]. creator ) ;
 _;
 }

 modifier EvidenceExists ( bytes32 ID , bool mustExist ) 
  {
 bool exists = evidences [ID].ID != 0x0;
 if ( mustExist )
 require (ID != 0x0 && exists ) ;
 else
 require (! exists ) ;
 _;
 }
  function CreateEvidence ( bytes32 ID , string memory description, string memory row)
   public EvidenceExists (ID , false )
   {  
  evidences [ID ]. ID = ID; 
  evidences [ID ]. owner = msg. sender;  
  evidences [ID ]. creator = msg. sender;  
  evidences [ID ]. description = description;  
  evidences [ID ]. taddr . push (msg. sender );  
  evidences [ID ]. ttime . push (block.timestamp) ;
  evidences [ID ]. evidenceArray = row ;
   }

  function Transfer ( bytes32 ID , address newowner )
   public OnlyOwner (ID) EvidenceExists (ID , true ){ 
   evidences [ID ]. owner = newowner;  
   evidences [ID ]. taddr . push ( newowner ) ; 
   evidences [ID ]. ttime . push (block.timestamp);
 }
function RemoveEvidence ( bytes32 ID)
 public OnlyCreator (ID) EvidenceExists (ID , true ) {
 delete evidences [ID ];
 }

 function GetEvidence ( bytes32 ID)
view public returns ( bytes32 , address , address ,
 string memory, address[] memory , uint [] memory, string memory) {
 return ( evidences [ID ].ID , evidences [ID ]. owner ,
 evidences [ID ]. creator , evidences [ID ]. description ,
evidences [ID ]. taddr , evidences [ID ]. ttime,evidences [ID ]. evidenceArray ) ;
 }
 }
