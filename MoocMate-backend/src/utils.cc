#include <boost/lexical_cast.hpp>
#include <boost/date_time.hpp>
#include "utils/utils.hh"

namespace {

unsigned char to_hex(unsigned char x)   
{   
	return  x > 9 ? x + 55 : x + 48;   
}  
  
unsigned char from_hex(unsigned char x)   
{   
	unsigned char y;  
	if(x >= 'A' && x <= 'F') 
    {
		y = x - 'A' + 10;  
	} 
    else if(x >= 'a' && x <= 'f') 
    {
		y = x - 'a' + 10;
	} 
    else if(x >= '0' && x <= '9') 
    {
		y = x - '0';
	} 
    else 
    {
        throw std::logic_error{"bad url when url decode"};
	}
	return y;  
}  
}
  
std::string urlEncode(const std::string& str)  
{  
	std::string str_temp = "";  
	size_t length = str.length();  
	for(size_t i = 0; i < length; i++) 
    {  
		if(std::isalnum(static_cast<unsigned char>(str[i])) ||   
			(str[i] == '-') ||  
			(str[i] == '_') ||   
			(str[i] == '.') ||   
			(str[i] == '~')) 
        {
			str_temp += str[i];
		} 
        else if(str[i] == ' ') 
        { 
 			str_temp += "+";  
		} 
        else 
        {  
			str_temp += '%';  
			str_temp += to_hex(static_cast<unsigned char>(str[i]) >> 4);  
			str_temp += to_hex(static_cast<unsigned char>(str[i]) % 16);  
		}  
	}
	return str_temp; 
}  
  
bool urlDecode(std::string& str)  
{  
	std::string str_temp = "";  
	size_t length = str.length();  
	for(size_t i = 0; i < length; i++) 
    {  
        if(str[i] == '+') 
        {
			str_temp += ' ';
		} 
        else if(str[i] == '%') 
        {  
			if(i + 2 >= length)
				return false;
			unsigned char high = 0;
			unsigned char low = 0;
		    
            high = from_hex(static_cast<unsigned char>(str[++i]));  
			low = from_hex(static_cast<unsigned char>(str[++i]));
			str_temp += high * 16 + low;
        } 
        else 
        {
			str_temp += str[i];  
		}
	}  
	str = str_temp;
	return true;
} 
