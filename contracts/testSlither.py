# function_writing.py
import sys
from slither.slither import Slither
 
if len(sys.argv) != 2:
    print('python.py function_writing.py file.sol')
    exit(-1)
 
# Init slither
slither = Slither(sys.argv[1])
 
# Get the contract
contract = slither.get_contract_from_name('ERC20Token')
 
# Get the variable
myVar = contract.get_state_variable_from_name('myVar')
 
# Get the functions writing the variable
funcs_writing_myVar = contract.get_functions_writing_to_variable(myVar)
 
# Print the result
print('Functions that write to &quot;myVar&quot;: {}'.format([f.name for f in funcs_writing_myVar]))
